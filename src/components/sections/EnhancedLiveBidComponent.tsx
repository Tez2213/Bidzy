"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BidAgent } from '@/lib/bidding/BidAgent';
import { BidPreferences, BidPreferencesData } from '@/components/bidding/BidPreferences';
import { MarketAnalysisPanel } from '@/components/bidding/MarketAnalysisPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Award, User, Bot, AlertCircle, TrendingDown, CheckCircle, Users, Edit, Check } from "lucide-react";
import { initializeSocket, joinAuction, leaveAuction, placeBid, onNewBid, onAuctionUpdate, onAuctionEnded, onCooldownUpdate, onUserCountUpdate } from "@/lib/socket/socketClient";
import { v4 as uuidv4 } from 'uuid'; // You may need to install this: npm install uuid

export interface Bid {
  userId: string;
  username: string;
  amount: number;
  timestamp: Date;
  isAiBid?: boolean;
}

interface LiveBidProps {
  auctionId: string;
  initialTimeRemaining: number; // in seconds
  startingBid: number;
  minimumDecrement: number;
  currentUserId: string;
  currentUsername: string;
}

// Replace your current functions with these safer versions that check for window
function getOrCreateUserId() {
  // Only run in browser environment
  if (typeof window === 'undefined') return 'temp-user-id';
  
  try {
    // Try to get existing userId from localStorage
    let userId = localStorage.getItem('bidzy_user_id');
    
    // If no existing ID, create a new one and save it
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('bidzy_user_id', userId);
    }
    
    return userId;
  } catch (error) {
    // Fallback in case of errors (private browsing etc.)
    console.error('Error accessing localStorage:', error);
    return `user-${Math.random().toString(36).substring(2, 10)}`;
  }
}

function getOrCreateUsername() {
  // Only run in browser environment
  if (typeof window === 'undefined') return 'Guest User';
  
  try {
    let username = localStorage.getItem('bidzy_username');
    
    if (!username) {
      // Generate a random name
      const adjectives = ['Smart', 'Quick', 'Bold', 'Clever', 'Brave', 'Witty'];
      const nouns = ['Bidder', 'Trader', 'Buyer', 'Player', 'Winner', 'Expert'];
      
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 100);
      
      username = `${randomAdjective}${randomNoun}${randomNum}`;
      localStorage.setItem('bidzy_username', username);
    }
    
    return username;
  } catch (error) {
    // Fallback in case of errors
    console.error('Error accessing localStorage:', error);
    return `Guest-${Math.random().toString(36).substring(2, 5)}`;
  }
}

export const EnhancedLiveBidComponent: React.FC<LiveBidProps> = ({
  auctionId,
  initialTimeRemaining = 3600, // 1 hour default
  startingBid = 100,
  minimumDecrement = 5,
  currentUserId: propUserId = "currentUser", 
  currentUsername: propUsername = "You"
}) => {
  // Use useEffect to handle localStorage operations safely
  const [currentUserId, setCurrentUserId] = useState<string>(propUserId);
  const [currentUsername, setCurrentUsername] = useState<string>(propUsername);
  const userIdInitialized = useRef(false);
  
  useEffect(() => {
    // Only run once and only in browser
    if (!userIdInitialized.current) {
      setCurrentUserId(getOrCreateUserId());
      setCurrentUsername(getOrCreateUsername());
      userIdInitialized.current = true;
    }
  }, []);
  
  // Add state for editing
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(currentUsername);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Add this function
  const handleUsernameChange = () => {
    if (editedUsername.trim()) {
      localStorage.setItem('bidzy_username', editedUsername);
      setCurrentUsername(editedUsername); // You'll need to make this state
      setIsEditingUsername(false);
    }
  };

  // State management
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeRemaining);
  const [currentBid, setCurrentBid] = useState<number>(startingBid);
  const [manualBidAmount, setManualBidAmount] = useState<number>(startingBid - minimumDecrement);
  const [leaderboard, setLeaderboard] = useState<Bid[]>([]);
  const [bidMode, setBidMode] = useState<'manual' | 'ai'>('manual');
  const [bidPreferences, setBidPreferences] = useState<BidPreferencesData>({
    isAIEnabled: false,
    minAcceptablePrice: 0,
    maxBidLimit: startingBid * 1.2,
    desiredProfitMargin: 15,
    riskTolerance: 'medium',
    bidAggressiveness: 50,
    autoBidFrequency: 'medium'
  });
  const [auctionEnded, setAuctionEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<Bid | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(1); // Default to 1 (current user)
  const [bidSubmitting, setBidSubmitting] = useState<boolean>(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidCooldown, setBidCooldown] = useState<number>(0);
  const [auctionEndReason, setAuctionEndReason] = useState<'timeout' | 'cooldown' | null>(null);
  
  const bidAgentRef = useRef<BidAgent | null>(null);
  const socketInitialized = useRef<boolean>(false);
  
  // Initialize socket connection
  useEffect(() => {
    if (!socketInitialized.current) {
      const socket = initializeSocket(currentUserId);
      if (socket) {
        socketInitialized.current = true;
        console.log('Socket connection established for auction:', auctionId);
      }
    }
    
    // Join auction room
    if (socketInitialized.current) {
      joinAuction(auctionId);
      
      // Clean up when component unmounts
      return () => {
        leaveAuction(auctionId);
      };
    }
  }, [auctionId, currentUserId]);

  // Listen for real-time auction events
  useEffect(() => {
    if (!socketInitialized.current) return;
    
    // Handle new bids from other users
    const unsubscribeNewBid = onNewBid(({ auctionId: eventAuctionId, bid }) => {
      if (eventAuctionId === auctionId) {
        // Convert string timestamp to Date object if needed
        const normalizedBid = {
          ...bid,
          timestamp: bid.timestamp instanceof Date ? bid.timestamp : new Date(bid.timestamp)
        };
        
        // Update local leaderboard with the new bid
        setLeaderboard(prev => {
          const updated = [normalizedBid, ...prev].sort((a, b) => a.amount - b.amount);
          return updated.slice(0, 10); // Keep top 10 bids
        });
      }
    });

    // Handle auction updates (syncs state with server)
    const unsubscribeAuctionUpdate = onAuctionUpdate(({ auctionId: eventAuctionId, currentBid: serverCurrentBid, leaderboard: serverLeaderboard, timeRemaining: serverTimeRemaining }) => {
      if (eventAuctionId === auctionId) {
        // Normalize timestamps in leaderboard data
        const normalizedLeaderboard = serverLeaderboard.map(bid => ({
          ...bid,
          timestamp: bid.timestamp instanceof Date ? bid.timestamp : new Date(bid.timestamp)
        }));
        
        setCurrentBid(serverCurrentBid);
        setLeaderboard(normalizedLeaderboard);
        setTimeRemaining(serverTimeRemaining);
        
        // Update manual bid amount suggestion based on current bid
        setManualBidAmount(Math.max(0, serverCurrentBid - minimumDecrement));
      }
    });

    // Handle auction ended event
    const unsubscribeAuctionEnded = onAuctionEnded(({ auctionId: eventAuctionId, winner: auctionWinner }) => {
      if (eventAuctionId === auctionId) {
        // Normalize winner timestamp
        const normalizedWinner = {
          ...auctionWinner,
          timestamp: auctionWinner.timestamp instanceof Date ? auctionWinner.timestamp : new Date(auctionWinner.timestamp)
        };
        
        setAuctionEnded(true);
        setWinner(normalizedWinner);
        // Set a default end reason since we don't receive it from the socket event
        setAuctionEndReason('timeout');
        
        // Stop AI bidding when auction ends
        if (bidAgentRef.current) {
          bidAgentRef.current.stop();
        }
      }
    });

    // Handle cooldown updates
    const unsubscribeCooldownUpdate = onCooldownUpdate(({ auctionId: eventAuctionId, cooldownRemaining }) => {
      if (eventAuctionId === auctionId) {
        setBidCooldown(cooldownRemaining);
      }
    });

    // Handle user count updates
    const unsubscribeUserCountUpdate = onUserCountUpdate(({ auctionId: eventAuctionId, activeUsers: serverActiveUsers }) => {
      if (eventAuctionId === auctionId) {
        setActiveUsers(serverActiveUsers);
      }
    });

    // Cleanup socket event listeners
    return () => {
      unsubscribeNewBid();
      unsubscribeAuctionUpdate();
      unsubscribeAuctionEnded();
      unsubscribeCooldownUpdate();
      unsubscribeUserCountUpdate();
    };
  }, [auctionId, minimumDecrement]);

  // Initialize bid agent
  useEffect(() => {
    if (!bidAgentRef.current) {
      bidAgentRef.current = new BidAgent({
        currentBid,
        timeRemaining,
        auctionId,
        minimumDecrement,
        leaderboard,
        userPreferences: bidPreferences,
        userId: currentUserId,
        username: currentUsername
      });
    }
    
    // Listen for AI bid events
    const handleAiBid = (event: CustomEvent) => {
      const { bid, auctionId: eventAuctionId } = event.detail;
      if (eventAuctionId === auctionId) {
        handleBid(bid, true);
      }
    };
    
    document.addEventListener('ai-bid-placed', handleAiBid as EventListener);
    
    return () => {
      document.removeEventListener('ai-bid-placed', handleAiBid as EventListener);
      if (bidAgentRef.current) {
        bidAgentRef.current.stop();
      }
    };
  }, [auctionId, currentUserId, currentUsername]);

  // Update bid agent context when relevant data changes
  useEffect(() => {
    if (bidAgentRef.current) {
      bidAgentRef.current.updateContext({
        currentBid,
        timeRemaining,
        leaderboard,
        userPreferences: bidPreferences
      });
    }
  }, [currentBid, timeRemaining, leaderboard, bidPreferences]);

  // Start or stop AI bidding based on preferences
  useEffect(() => {
    if (bidAgentRef.current) {
      if (bidMode === 'ai' && bidPreferences.isAIEnabled && !auctionEnded) {
        bidAgentRef.current.start();
      } else {
        bidAgentRef.current.stop();
      }
    }
  }, [bidMode, bidPreferences.isAIEnabled, auctionEnded]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Handle manual bid submission
  const handleManualBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    
    if (manualBidAmount >= currentBid) {
      setBidError(`Your bid must be lower than the current lowest bid of $${currentBid}`);
      return;
    }

    if (currentBid - manualBidAmount < minimumDecrement) {
      setBidError(`Minimum bid decrement is $${minimumDecrement}`);
      return;
    }

    const newBid: Bid = {
      userId: currentUserId,
      username: currentUsername,
      amount: manualBidAmount,
      timestamp: new Date()
    };

    try {
      setBidSubmitting(true);
      await handleBid(newBid);
      // Set next suggested bid amount
      setManualBidAmount(Math.max(0, manualBidAmount - minimumDecrement));
    } finally {
      setBidSubmitting(false);
    }
  };

  // Process a new bid (whether manual or AI)
  const handleBid = async (newBid: Bid, isAiBid: boolean = false) => {
    // If it's an AI bid, mark it
    if (isAiBid) {
      newBid.isAiBid = true;
    }
    
    try {
      // Send bid to server via socket
      const success = placeBid(auctionId, newBid);
      
      if (!success) {
        throw new Error('Failed to place bid');
      }
      
      // Optimistically update local state
      setLeaderboard(prev => {
        const updated = [newBid, ...prev].sort((a, b) => a.amount - b.amount);
        return updated.slice(0, 10);
      });
      
      if (newBid.amount < currentBid) {
        setCurrentBid(newBid.amount);
      }
      
      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Failed to place bid. Please try again.');
      return false;
    }
  };

  // Handle bid preference updates
  const handleBidPreferencesUpdate = (newPreferences: BidPreferencesData) => {
    setBidPreferences(newPreferences);
  };

  // Determine urgency color based on time remaining
  const getTimeRemainingColor = () => {
    if (timeRemaining < 60) return "text-red-500"; // Last minute
    if (timeRemaining < 300) return "text-amber-400"; // Last 5 minutes
    return "text-blue-400";
  };

  // For testing - force end auction
  const forceEndAuction = () => {
    // In a real implementation, this would be a socket event sent to the server
    // For now, just update local state
    if (leaderboard.length > 0) {
      const sortedBids = [...leaderboard].sort((a, b) => a.amount - b.amount);
      setWinner(sortedBids[0]);
    }
    setAuctionEnded(true);
  };

  const formatCooldown = (seconds: number): string => {
    return `${seconds}s`;
  };

  return (
    // Wrapping everything in a dark container that fills the screen
    <div className="w-full min-h-screen bg-zinc-900 py-10 px-4" style={{
      background: "linear-gradient(to bottom, #18181b, #09090b)",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0
    }}>
      <div className="live-bid-container max-w-6xl mx-auto">
        {/* Header with Auction Title */}
        <div className="text-center mb-8">
  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Live Logistics Auction</h2>
  <p className="text-zinc-400 mt-1">Project #L{
    typeof auctionId === 'string' && auctionId.length >= 4 
      ? auctionId.slice(-4) 
      : (typeof auctionId === 'string' ? auctionId : '0000')
  }</p>
</div>
        
        {/* Active Users Indicator */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex items-center gap-1.5 bg-zinc-800/70 px-3 py-1.5 rounded-full">
            <User size={14} className="text-blue-400" />
            <span className="text-zinc-300 text-sm">{activeUsers} Active {activeUsers === 1 ? 'Bidder' : 'Bidders'}</span>
          </div>
          
          {bidCooldown > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-900/30 border border-amber-700/30 px-3 py-1.5 rounded-full">
              <Clock size={14} className="text-amber-400" />
              <span className="text-amber-300 text-sm">
                Bid locks in {formatCooldown(bidCooldown)}
              </span>
            </div>
          )}
        </div>
        
        {/* For testing - Add a button to force end the auction */}
        {!auctionEnded && process.env.NODE_ENV === 'development' && (
          <div className="text-center mb-4">
            <button 
              onClick={forceEndAuction}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm text-zinc-300 border border-zinc-700"
            >
              Test: End Auction Now
            </button>
          </div>
        )}
        
        {/* Winner Announcement (shows when auction ends) */}
        {auctionEnded && winner && (
          <div className="bg-gradient-to-r from-emerald-900/80 to-emerald-800/80 rounded-xl p-5 mb-8 shadow-xl border border-emerald-700/50 animate-fadeIn">
            <div className="flex items-center">
              <div className="bg-emerald-500/20 p-3 rounded-full mr-4">
                <CheckCircle size={38} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-300 mb-1">Auction Completed</h3>
                <p className="text-emerald-200">
                  <span className="font-semibold">
                    {winner.userId === currentUserId ? "You" : winner.username}
                  </span> won the contract with a bid of <span className="font-semibold">${winner.amount}</span>
                </p>
                <p className="text-sm text-emerald-300/70 mt-1">
                  {auctionEndReason === 'cooldown' 
                    ? 'Auction ended due to 30-second bid inactivity'
                    : 'Auction ended as time expired'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Timer and Bid Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Current Bid Card */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-5 shadow-xl border border-zinc-700/50 col-span-1 md:col-span-2 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-zinc-400 mb-1 text-sm flex items-center gap-1">
                <TrendingDown size={14} className="text-emerald-400" /> Current Lowest Bid
              </div>
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 flex items-center">
                <DollarSign size={28} className="mb-1" />{currentBid}
              </div>
              {leaderboard.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-zinc-300">
                  <User size={14} className="text-zinc-400" />
                  <span>
                    {leaderboard[0].userId === currentUserId ? "You" : leaderboard[0].username}
                    {leaderboard[0].isAiBid && <Badge variant="outline" className="ml-1.5 bg-indigo-900/40 text-indigo-300 border-indigo-700/50 text-xs">AI</Badge>}
                  </span>
                  {auctionEnded && leaderboard[0].userId === winner?.userId && (
                    <Badge className="ml-2 bg-emerald-900/40 text-emerald-300 border-emerald-700/50">Winner</Badge>
                  )}
                </div>
              )}
            </div>
            {bidCooldown > 0 && (
              <div className="mt-4 w-full bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
                <div className="flex flex-col items-center">
                  <div className="text-sm text-amber-300 font-medium mb-1 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    No new bids in {formatCooldown(bidCooldown)} will end auction
                  </div>
                  <div className="w-full bg-zinc-700/50 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full" 
                      style={{ width: `${(bidCooldown / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Timer Card */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-5 shadow-xl border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex flex-col h-full justify-center items-center">
              <div className="text-zinc-400 mb-1 text-sm flex items-center gap-1">
                <Clock size={14} className="text-blue-400" /> 
                {auctionEnded ? "Auction Ended" : "Auction Closes In"}
              </div>
              {!auctionEnded ? (
                <div className={`text-3xl font-bold ${getTimeRemainingColor()}`}>
                  {formatTime(timeRemaining)}
                </div>
              ) : (
                <div className="text-2xl font-bold text-zinc-300">Completed</div>
              )}
              <div className="mt-3 text-xs text-zinc-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Auction Description Card */}
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl p-5 mb-6 border border-zinc-700/50 shadow-xl backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-emerald-500 rounded-full"></span>
            Project Details
          </h3>
          <p className="text-zinc-300 mb-4 leading-relaxed">
            Looking for contractors to provide logistics services for shipment of goods from Shanghai to Los Angeles.
            This is a reverse auction - the lowest bid wins the contract. Requirements include temperature-controlled 
            transport and real-time tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30">
            <div>
              <span className="text-zinc-500">Starting Bid:</span>
              <span className="text-zinc-200 ml-2">${startingBid}</span>
            </div>
            <div>
              <span className="text-zinc-500">Min. Decrement:</span>
              <span className="text-zinc-200 ml-2">${minimumDecrement}</span>
            </div>
            <div>
              <span className="text-zinc-500">Est. Value:</span>
              <span className="text-zinc-200 ml-2">${startingBid + 50}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bidding Interface */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            {!auctionEnded ? (
              <>
                {/* Bidding Mode Tabs */}
                <Tabs 
                  defaultValue="manual" 
                  value={bidMode} 
                  onValueChange={(value) => setBidMode(value as 'manual' | 'ai')}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 mb-4 bg-zinc-800/80 border border-zinc-700/50">
                    <TabsTrigger 
                      value="manual" 
                      className="data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100 text-zinc-400"
                    >
                      Manual Bidding
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai" 
                      className="data-[state=active]:bg-zinc-700 data-[state=active]:text-indigo-300 text-zinc-400"
                    >
                      <Bot size={14} className="mr-1" /> AI-Assisted
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual">
                    <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl p-6 shadow-xl border border-zinc-700/50 backdrop-blur-sm">
                      <form onSubmit={handleManualBidSubmit} className="space-y-5">
                        <div>
                          <label className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
                            <DollarSign size={14} className="text-emerald-400" />
                            Your Bid Amount
                          </label>
                          <div className="flex items-center">
                            <span className="bg-zinc-700 text-zinc-300 px-3 py-2 rounded-l-md border-r border-zinc-600">$</span>
                            <Input
                              type="number"
                              value={manualBidAmount}
                              onChange={e => setManualBidAmount(Number(e.target.value))}
                              max={currentBid - minimumDecrement}
                              step={1}
                              className="rounded-l-none bg-zinc-700 border-zinc-600 text-zinc-200"
                              disabled={bidSubmitting}
                            />
                          </div>
                          <div className="flex flex-col text-xs mt-2">
                            <span className="text-zinc-400 flex items-center gap-1">
                              <AlertCircle size={12} />
                              Maximum bid: ${currentBid - minimumDecrement} (must be lower than current bid)
                            </span>
                            
                            {/* Error message */}
                            {bidError && (
                              <span className="text-red-400 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {bidError}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg h-12"
                          disabled={bidSubmitting}
                        >
                          {bidSubmitting ? 'Placing Bid...' : 'Place Bid Now'}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ai" className="space-y-6">
                    <BidPreferences
                      initialPreferences={bidPreferences}
                      onUpdate={handleBidPreferencesUpdate}
                      itemStartingPrice={startingBid}
                    />
                    
                    <MarketAnalysisPanel
                      leaderboard={leaderboard}
                      currentBid={currentBid}
                      timeRemaining={timeRemaining}
                    />
                  </TabsContent>
                </Tabs>
                
                {/* Reverse Auction Info */}
                <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 rounded-lg p-4 border border-amber-700/20">
                  <h4 className="flex items-center gap-1.5 text-zinc-200 font-medium mb-2">
                    <AlertCircle size={16} className="text-amber-400" /> 
                    Reverse Auction Rules
                  </h4>
                  <p className="text-sm text-zinc-400">
                    This is a reverse auction where the lowest bid wins. Bid only what you're comfortable accepting for the project.
                    The AI assistant will adapt to market conditions and place strategic bids on your behalf if enabled.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl p-6 shadow-xl border border-zinc-700/50">
                <h3 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                  Auction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 px-1 border-b border-zinc-700/30">
                    <span className="text-zinc-400">Starting Bid:</span>
                    <span className="text-zinc-200 font-medium">${startingBid}</span>
                  </div>
                  <div className="flex justify-between py-3 px-1 border-b border-zinc-700/30">
                    <span className="text-zinc-400">Final Bid:</span>
                    <span className="text-emerald-400 font-medium">${winner?.amount}</span>
                  </div>
                  <div className="flex justify-between py-3 px-1 border-b border-zinc-700/30">
                    <span className="text-zinc-400">Total Savings:</span>
                    <span className="text-emerald-300 font-medium">${startingBid - (winner?.amount || 0)}</span>
                  </div>
                  <div className="flex justify-between py-3 px-1 border-b border-zinc-700/30">
                    <span className="text-zinc-400">Total Bids Placed:</span>
                    <span className="text-zinc-200 font-medium">{leaderboard.length}</span>
                  </div>
                  <div className="flex justify-between py-3 px-1">
                    <span className="text-zinc-400">Winner:</span>
                    <span className="text-zinc-200 font-medium">
                      {winner?.userId === currentUserId ? "You" : winner?.username}
                      {winner?.isAiBid && " (AI Bid)"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl shadow-xl border border-zinc-700/50 overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-zinc-700/50 bg-zinc-800/80">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <Award size={16} className="text-emerald-400" />
                  Bid History
                </h3>
              </div>
              
              <div className="px-0 py-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800/50">
                {leaderboard.length > 0 ? (
                  <div className="space-y-0.5">
                    {leaderboard.map((bid, index) => (
                      <div 
                        key={`${bid.userId}-${bid.timestamp.getTime()}-${index}`}
                        className={`flex justify-between items-center py-3 px-5 ${
                          index === 0 ? 'bg-zinc-700/60 border-l-2 border-emerald-500' : 
                          index === 1 ? 'bg-zinc-700/30 border-l-2 border-zinc-500' : 
                          'hover:bg-zinc-700/20'
                        } ${bid.userId === currentUserId ? 'bg-zinc-700/40' : ''}`}
                      >
                        <div className="flex items-center">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${
                            index === 0 ? 'bg-emerald-500 text-zinc-900' : 
                            index === 1 ? 'bg-zinc-500 text-zinc-900' : 
                            'bg-zinc-700 text-zinc-300'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-medium text-zinc-200 flex items-center">
                              {bid.userId === currentUserId ? (
                                <span className="text-blue-400">You</span>
                              ) : bid.username}
                              {bid.isAiBid && <Badge className="ml-2 bg-indigo-900/40 text-indigo-300 border-indigo-700/50 text-xs" variant="outline">AI</Badge>}
                              {auctionEnded && bid.userId === winner?.userId && (
                                <Badge className="ml-2 bg-emerald-900/40 text-emerald-300 border-emerald-700/50 text-xs">Winner</Badge>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-zinc-100">${bid.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <Award size={40} className="text-zinc-600 mb-3" />
                    <p className="text-zinc-500">
                      No bids yet. Be the first to bid!
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bidding Rules Info Card */}
            <div className="bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 rounded-xl p-5 shadow-lg border border-zinc-700/30 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-emerald-400" />
                Reverse Auction Rules
              </h4>
              <ul className="text-xs text-zinc-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  Lowest bid wins the contract
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  Minimum bid decrement: ${minimumDecrement}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  All bids are final and binding
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  AI assistant adapts to market conditions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  Winner is responsible for delivering services at bid price
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};