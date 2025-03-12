import type { BidPreferencesData } from "@/components/bidding/BidPreferences";
import type { Bid } from "@/components/sections/EnhancedLiveBidComponent";

interface MarketAnalysis {
  averageBidIncrement: number;
  bidFrequency: number; 
  competitorCount: number;
  marketTrend: 'rising' | 'stable' | 'cooling';
  estimatedFinalPrice: number;
  aiActivity: number;
}

interface StrategyContext {
  currentBid: number;
  timeRemaining: number;
  minimumIncrement: number;
  preferences: BidPreferencesData;
  marketAnalysis: MarketAnalysis;
  userBidHistory: Bid[];
}

export class BidStrategyService {
  /**
   * Determines the optimal bid amount based on user preferences and market conditions
   */
  public static determineOptimalBid(context: StrategyContext): number {
    const { 
      currentBid, 
      minimumIncrement, 
      preferences, 
      marketAnalysis,
      timeRemaining 
    } = context;
    
    // Don't bid if we're already over the max limit
    if (currentBid >= preferences.maxBidLimit) {
      return 0;
    }
    
    let optimalBid = currentBid + minimumIncrement;
    
    // Apply base strategy according to risk tolerance
    optimalBid = this.applyRiskStrategy(optimalBid, context);
    
    // Apply market-responsive adjustments
    optimalBid = this.applyMarketAdjustments(optimalBid, context);
    
    // Apply time-based strategy
    optimalBid = this.applyTimeStrategy(optimalBid, context);
    
    // Apply profit margin protection
    const profitThreshold = preferences.minAcceptablePrice * 
      (1 + preferences.desiredProfitMargin / 100);
      
    if (optimalBid > profitThreshold && preferences.riskTolerance === 'low') {
      optimalBid = Math.min(optimalBid, profitThreshold);
    }
    
    // Never exceed user's maximum bid limit
    return Math.min(optimalBid, preferences.maxBidLimit);
  }
  
  /**
   * Determines if it's a good time to place a bid
   */
  public static shouldBidNow(context: StrategyContext): boolean {
    const { timeRemaining, preferences, marketAnalysis } = context;
    
    // Always bid in the final moments
    if (timeRemaining <= 10) return true;
    
    // Strategic bidding based on auction phase
    if (this.isAuctionEndgame(timeRemaining)) {
      // Final phase - more aggressive
      const aggressiveness = preferences.bidAggressiveness / 100;
      return Math.random() < (0.3 + (aggressiveness * 0.5));
    }
    
    if (this.isAuctionMidgame(timeRemaining)) {
      // Middle phase - moderate
      if (marketAnalysis.marketTrend === 'rising') {
        // More likely to bid in rising markets
        return Math.random() < 0.25;
      }
      return Math.random() < 0.15;
    }
    
    // Early phase - conservative
    // Bid only occasionally based on frequency preference
    const baseChance = this.getBidChanceByFrequency(preferences.autoBidFrequency);
    return Math.random() < baseChance;
  }
  
  /**
   * Applies risk-based strategy adjustments
   */
  private static applyRiskStrategy(bid: number, context: StrategyContext): number {
    const { preferences, minimumIncrement, marketAnalysis } = context;
    
    switch(preferences.riskTolerance) {
      case 'low':
        // Conservative - minimal increments
        return bid;
        
      case 'medium':
        // Balanced - moderate increments based on market
        if (marketAnalysis.marketTrend === 'rising') {
          return bid + Math.ceil(minimumIncrement * 0.5);
        }
        return bid;
        
      case 'high':
        // Aggressive - larger increments
        const increment = minimumIncrement * (1 + (marketAnalysis.competitorCount * 0.2));
        return bid + Math.ceil(increment * (preferences.bidAggressiveness / 100));
        
      default:
        return bid;
    }
  }
  
  /**
   * Applies market condition responsive adjustments
   */
  private static applyMarketAdjustments(bid: number, context: StrategyContext): number {
    const { marketAnalysis, minimumIncrement, preferences } = context;
    let adjustedBid = bid;
    
    // Adjust based on market trend
    if (marketAnalysis.marketTrend === 'rising' && preferences.riskTolerance !== 'low') {
      // In rising markets, bid more aggressively
      const trendMultiplier = preferences.riskTolerance === 'high' ? 2.0 : 1.5;
      adjustedBid += Math.ceil(minimumIncrement * (trendMultiplier - 1));
    }
    
    // Adjust based on competition
    if (marketAnalysis.competitorCount > 5) {
      // High competition - more aggressive bidding
      const competitionFactor = Math.min(0.2 * marketAnalysis.competitorCount, 1);
      adjustedBid += Math.ceil(minimumIncrement * competitionFactor * (preferences.bidAggressiveness / 100));
    }
    
    // Adjust based on AI activity
    if (marketAnalysis.aiActivity > 50) {
      // High AI activity - outsmart other AIs by being less predictable
      const randomFactor = Math.random() * minimumIncrement * (preferences.bidAggressiveness / 100);
      adjustedBid += Math.ceil(randomFactor);
    }
    
    return adjustedBid;
  }
  
  /**
   * Applies time-based strategy adjustments
   */
  private static applyTimeStrategy(bid: number, context: StrategyContext): number {
    const { timeRemaining, minimumIncrement, preferences } = context;
    
    if (timeRemaining <= 10) {
      // Final moments - maximum aggression to win
      const finalPush = preferences.riskTolerance === 'high' ? 3 : 
                        preferences.riskTolerance === 'medium' ? 2 : 1;
      return bid + (minimumIncrement * finalPush);
    }
    
    if (this.isAuctionEndgame(timeRemaining)) {
      // End game - increased aggression
      const endgameFactor = preferences.riskTolerance === 'high' ? 0.5 : 
                            preferences.riskTolerance === 'medium' ? 0.3 : 0.1;
      return bid + Math.ceil(minimumIncrement * endgameFactor);
    }
    
    return bid;
  }
  
  /**
   * Checks if auction is in end game phase (last few minutes)
   */
  private static isAuctionEndgame(timeRemaining: number): boolean {
    return timeRemaining <= 180; // Last 3 minutes
  }
  
  /**
   * Checks if auction is in mid game phase
   */
  private static isAuctionMidgame(timeRemaining: number): boolean {
    return timeRemaining > 180 && timeRemaining <= 900; // Between 3-15 minutes
  }
  
  /**
   * Get bid probability based on frequency preference
   */
  private static getBidChanceByFrequency(frequency: string): number {
    switch(frequency) {
      case 'low': return 0.05; // 5% chance
      case 'medium': return 0.10; // 10% chance
      case 'high': return 0.20; // 20% chance
      default: return 0.10;
    }
  }
}