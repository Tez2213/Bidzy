import type { BidPreferencesData } from "@/components/bidding/BidPreferences";
import { Bid } from "@/components/sections/EnhancedLiveBidComponent";
import { BidStrategyService } from "./BidStrategyService";

interface BidAgentContext {
  currentBid: number;
  timeRemaining: number; // in seconds
  auctionId: string;
  minimumDecrement: number; // changed from minimumIncrement for reverse auction
  leaderboard: Bid[];
  userPreferences: BidPreferencesData;
  userId: string;
  username: string;
}

export class BidAgent {
  private context: BidAgentContext;
  private lastAnalysisTime: number = 0;
  private lastBidTime: number = 0;
  private nextScheduledBidTime: number | null = null;
  private isActive: boolean = false;
  private userBidHistory: Bid[] = [];
  private bidCount: number = 0;
  private readonly MIN_REBID_DELAY = 5000; // Minimum 5 seconds between AI bids

  constructor(context: BidAgentContext) {
    this.context = context;
    // Initialize user bid history from leaderboard
    this.userBidHistory = context.leaderboard.filter(bid => 
      bid.userId === context.userId
    );
  }

  public updateContext(partialContext: Partial<BidAgentContext>): void {
    const previousBid = this.context.currentBid;
    this.context = { ...this.context, ...partialContext };
    
    // Update user bid history if leaderboard changed
    if (partialContext.leaderboard) {
      this.userBidHistory = partialContext.leaderboard.filter(bid => 
        bid.userId === this.context.userId
      );
    }
    
    // If the current bid has changed and we're not the current lowest bidder,
    // trigger analysis to see if we should bid again
    const lowestBidderChanged = previousBid !== this.context.currentBid;
    const isLowestBidder = this.context.leaderboard.length > 0 && 
                          this.context.leaderboard[0].userId === this.context.userId;
    
    // If AI bidding is enabled and we have new context, analyze market again
    if (this.isActive && this.context.userPreferences.isAIEnabled && 
       (lowestBidderChanged || !isLowestBidder)) {
      this.analyzeMarket(true);
    }
  }

  public start(): void {
    this.isActive = true;
    if (this.context.userPreferences.isAIEnabled) {
      this.analyzeMarket();
      this.scheduleBidCheck();
    }
  }

  public stop(): void {
    this.isActive = false;
    if (this.nextScheduledBidTime) {
      clearTimeout(this.nextScheduledBidTime as unknown as number);
      this.nextScheduledBidTime = null;
    }
  }

  private analyzeMarket(forcedAnalysis: boolean = false): void {
    const now = Date.now();
    
    // Only analyze if it's been at least 2 seconds since last analysis,
    // unless this is a forced analysis (due to bid changes)
    if (!forcedAnalysis && now - this.lastAnalysisTime < 2000) return;
    
    this.lastAnalysisTime = now;
    
    const {
      currentBid,
      minimumDecrement,
      timeRemaining,
      userPreferences,
      leaderboard,
    } = this.context;
    
    // Don't bid if current bid is already below our minimum acceptable price
    // (This is reverse auction logic - we don't want to go below our minimum)
    if (currentBid <= userPreferences.minAcceptablePrice) {
      console.log("Current bid below minimum acceptable price. Not bidding.");
      return;
    }
    
    // Don't bid again if we're already the lowest bidder
    if (leaderboard.length > 0 && leaderboard[0].userId === this.context.userId) {
      console.log("Already lowest bidder. No need to bid again.");
      return;
    }
    
    // Don't bid too frequently
    if (now - this.lastBidTime < this.MIN_REBID_DELAY) {
      console.log("Too soon after last bid. Waiting before bidding again.");
      // Schedule another check soon
      setTimeout(() => this.analyzeMarket(), this.MIN_REBID_DELAY);
      return;
    }
    
    // Generate market analysis
    const marketAnalysis = this.generateMarketAnalysis();
    
    // Pass to strategy service for decision making
    const strategyContext = {
      currentBid,
      timeRemaining,
      minimumDecrement,
      preferences: userPreferences,
      marketAnalysis,
      userBidHistory: this.userBidHistory,
      isReverseAuction: true // Inform strategy this is a reverse auction
    };
    
    // Calculate optimal bid amount for a reverse auction (lower is better)
    const optimalBid = this.calculateOptimalBidForReverseAuction(strategyContext);
    
    // Determine if we should bid now
    const shouldBidNow = this.shouldPlaceBidNow(strategyContext);
    
    console.log("AI bid analysis:", { 
      optimalBid, 
      shouldBidNow, 
      currentBid, 
      minimumAcceptable: userPreferences.minAcceptablePrice 
    });
    
    if (shouldBidNow && optimalBid > 0) {
      this.placeBid(optimalBid);
    } else {
      // Schedule next bid check based on bidding frequency preference
      const checkInterval = this.getBidCheckInterval();
      if (this.nextScheduledBidTime) {
        clearTimeout(this.nextScheduledBidTime as unknown as number);
      }
      this.nextScheduledBidTime = setTimeout(() => this.analyzeMarket(), checkInterval) as unknown as number;
    }
  }
  
  private calculateOptimalBidForReverseAuction(strategyContext: any): number {
    const { currentBid, minimumDecrement, preferences } = strategyContext;
    
    // For reverse auction, we want to go lower than current lowest bid, but not below our minimum
    let optimalBid = currentBid - minimumDecrement;
    
    // Apply different strategies based on risk tolerance
    switch(preferences.riskTolerance) {
      case 'low':
        // Conservative - bid just slightly below current bid
        optimalBid = currentBid - minimumDecrement;
        break;
        
      case 'medium':
        // Balanced - moderate underbid based on time and competition
        const moderateDecrement = minimumDecrement * 1.5;
        optimalBid = currentBid - moderateDecrement;
        break;
        
      case 'high':
        // Aggressive - larger decrements, but still protecting profit margin
        const aggressiveDecrement = minimumDecrement * 
          (2 + (preferences.bidAggressiveness / 100));
        optimalBid = currentBid - Math.ceil(aggressiveDecrement);
        break;
    }
    
    // Never bid below minimum acceptable price
    return Math.max(optimalBid, preferences.minAcceptablePrice);
  }
  
  private shouldPlaceBidNow(strategyContext: any): boolean {
    const { timeRemaining, preferences } = strategyContext;
    
    // Always bid in the final seconds
    if (timeRemaining <= 15) return true;
    
    // More likely to bid as time runs out
    if (timeRemaining < 60) {
      return Math.random() > 0.3; // 70% chance in last minute
    }
    
    if (timeRemaining < 300) {
      return Math.random() > 0.7; // 30% chance in last 5 minutes
    }
    
    // Base chance on bid frequency preference
    const baseChance = this.getBidChanceByFrequency(preferences.autoBidFrequency);
    return Math.random() > (1 - baseChance);
  }
  
  private getBidChanceByFrequency(frequency: string): number {
    switch(frequency) {
      case 'low': return 0.1; // 10% chance
      case 'medium': return 0.2; // 20% chance  
      case 'high': return 0.35; // 35% chance
      default: return 0.2;
    }
  }
  
  private generateMarketAnalysis() {
    const { leaderboard, timeRemaining, currentBid } = this.context;
    
    // Sort by amount (lowest first for reverse auction)
    const sortedBids = [...leaderboard].sort(
      (a, b) => a.amount - b.amount
    );
    
    // Calculate average bid decrement
    let totalDecrement = 0;
    let decrementCount = 0;
    for (let i = 0; i < sortedBids.length - 1; i++) {
      const decrement = sortedBids[i+1].amount - sortedBids[i].amount;
      totalDecrement += Math.abs(decrement); // Use absolute value
      decrementCount++;
    }
    const averageBidDecrement = decrementCount > 0 
      ? totalDecrement / decrementCount 
      : this.context.minimumDecrement;
      
    // Calculate bid frequency (bids per minute)
    let bidFrequency = 0;
    if (sortedBids.length >= 2) {
      const oldestBid = sortedBids[sortedBids.length - 1].timestamp;
      const newestBid = sortedBids[0].timestamp;
      const timeSpanMinutes = (newestBid.getTime() - oldestBid.getTime()) / (1000 * 60);
      bidFrequency = timeSpanMinutes > 0 
        ? sortedBids.length / timeSpanMinutes 
        : 1;
    }
    
    // Count unique bidders (competitors)
    const uniqueBidders = new Set(sortedBids.map(bid => bid.userId)).size;
    
    // Determine market trend (for reverse auction, cooling means bids are getting lower faster)
    let marketTrend: 'rising' | 'stable' | 'cooling' = 'stable';
    if (sortedBids.length >= 5) {
      const recentBids = sortedBids.slice(0, Math.min(5, Math.floor(sortedBids.length / 2)));
      const olderBids = sortedBids.slice(Math.max(0, sortedBids.length - 5));
      
      if (recentBids.length > 1 && olderBids.length > 1) {
        const recentAvgAmount = recentBids.reduce((sum, bid) => sum + bid.amount, 0) / recentBids.length;
        const olderAvgAmount = olderBids.reduce((sum, bid) => sum + bid.amount, 0) / olderBids.length;
        
        if (recentAvgAmount < olderAvgAmount * 0.95) {
          marketTrend = 'cooling'; // Bids getting lower fast (aggressive)
        } else if (recentAvgAmount > olderAvgAmount * 0.99) {
          marketTrend = 'rising'; // Bids not decreasing much (conservative)
        }
      }
    }
    
    // Calculate AI activity
    const aiCount = sortedBids.filter(bid => bid.isAiBid).length;
    const aiActivity = sortedBids.length > 0 ? (aiCount / sortedBids.length) * 100 : 0;
    
    // Estimate final price (for reverse auction, it will be lower than current)
    const estimatedAdditionalBids = bidFrequency * (timeRemaining / 60);
    const estimatedFinalPrice = currentBid - (averageBidDecrement * estimatedAdditionalBids);
    // Don't estimate below the likely minimum someone would bid
    const lowestEstimate = currentBid * 0.7;
    
    return {
      averageBidDecrement,
      bidFrequency,
      competitorCount: uniqueBidders,
      marketTrend,
      estimatedFinalPrice: Math.max(estimatedFinalPrice, lowestEstimate),
      aiActivity
    };
  }
  
  private getBidCheckInterval(): number {
    // More frequent checks when time is running out
    if (this.context.timeRemaining < 60) return 2000; // 2 seconds
    if (this.context.timeRemaining < 300) return 5000; // 5 seconds
    
    // Base interval on bidding frequency preference
    switch(this.context.userPreferences.autoBidFrequency) {
      case 'low': return 30000; // 30 seconds
      case 'medium': return 15000; // 15 seconds
      case 'high': return 8000; // 8 seconds
      default: return 20000; // 20 seconds
    }
  }
  
  private scheduleBidCheck(): void {
    if (!this.isActive) return;
    
    const interval = this.getBidCheckInterval();
    setTimeout(() => {
      if (this.isActive) {
        this.analyzeMarket();
        this.scheduleBidCheck(); // Schedule next check
      }
    }, interval);
  }
  
  private placeBid(amount: number): void {
    // Update last bid time
    this.lastBidTime = Date.now();
    this.bidCount++;
    
    // Create a new bid event
    const newBid: Bid = {
      userId: this.context.userId,
      username: `${this.context.username} (AI)`,
      amount: amount,
      timestamp: new Date(),
      isAiBid: true
    };
    
    // Add to user bid history
    this.userBidHistory.push(newBid);
    
    console.log(`AI agent placing bid: $${amount} for user ${this.context.username} (bid #${this.bidCount})`);
    
    // Dispatch bid event (this would be handled by your bid processing system)
    const bidEvent = new CustomEvent("ai-bid-placed", { 
      detail: { 
        bid: newBid,
        auctionId: this.context.auctionId
      } 
    });
    document.dispatchEvent(bidEvent);
  }
}