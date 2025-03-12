"use client";

import { useState, useEffect } from 'react';
import { Bid } from '@/components/sections/EnhancedLiveBidComponent';

interface BidAnalysis {
  averageBidIncrement: number;
  bidFrequency: number; // bids per minute
  competitorCount: number;
  marketTrend: 'rising' | 'stable' | 'cooling';
  estimatedFinalPrice: number;
  aiActivity: number; // percentage of bids from AI
}

export function useBidAnalysis(
  leaderboard: Bid[],
  currentBid: number,
  timeRemaining: number
): BidAnalysis {
  const [analysis, setAnalysis] = useState<BidAnalysis>({
    averageBidIncrement: 0,
    bidFrequency: 0,
    competitorCount: 0,
    marketTrend: 'stable',
    estimatedFinalPrice: currentBid,
    aiActivity: 0
  });

  useEffect(() => {
    if (leaderboard.length < 2) {
      return;
    }

    // Sort by timestamp (newest first)
    const sortedBids = [...leaderboard].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Calculate average bid increment
    let totalIncrement = 0;
    let incrementCount = 0;
    for (let i = 0; i < sortedBids.length - 1; i++) {
      const increment = sortedBids[i].amount - sortedBids[i + 1].amount;
      totalIncrement += increment;
      incrementCount++;
    }
    const averageBidIncrement = incrementCount > 0 
      ? totalIncrement / incrementCount 
      : 0;

    // Calculate bid frequency (bids per minute)
    const oldestBid = sortedBids[sortedBids.length - 1].timestamp;
    const newestBid = sortedBids[0].timestamp;
    const timeSpanMinutes = (newestBid.getTime() - oldestBid.getTime()) / (1000 * 60);
    const bidFrequency = timeSpanMinutes > 0 
      ? sortedBids.length / timeSpanMinutes 
      : 0;

    // Count unique bidders (competitors)
    const uniqueBidders = new Set(sortedBids.map(bid => bid.userId)).size;

    // Determine market trend
    let marketTrend: 'rising' | 'stable' | 'cooling' = 'stable';
    if (sortedBids.length >= 5) {
      const recentBids = sortedBids.slice(0, 5);
      const olderBids = sortedBids.slice(Math.max(0, sortedBids.length - 5));
      
      const recentAvgIncrement = recentBids.reduce((sum, bid, i, arr) => {
        if (i === arr.length - 1) return sum;
        return sum + (arr[i].amount - arr[i+1].amount);
      }, 0) / (recentBids.length - 1);
      
      const olderAvgIncrement = olderBids.reduce((sum, bid, i, arr) => {
        if (i === arr.length - 1) return sum;
        return sum + (arr[i].amount - arr[i+1].amount);
      }, 0) / (olderBids.length - 1);
      
      if (recentAvgIncrement > olderAvgIncrement * 1.25) {
        marketTrend = 'rising';
      } else if (recentAvgIncrement < olderAvgIncrement * 0.75) {
        marketTrend = 'cooling';
      }
    }
    
    // Calculate AI activity
    const aiCount = sortedBids.filter(bid => bid.isAiBid).length;
    const aiActivity = (aiCount / sortedBids.length) * 100;
    
    // Estimate final price
    // Simple prediction based on current bid, time remaining, and bid frequency
    const estimatedAdditionalBids = bidFrequency * (timeRemaining / 60);
    const estimatedFinalPrice = currentBid + (averageBidIncrement * estimatedAdditionalBids);
    
    setAnalysis({
      averageBidIncrement,
      bidFrequency,
      competitorCount: uniqueBidders,
      marketTrend,
      estimatedFinalPrice,
      aiActivity
    });
    
  }, [leaderboard, currentBid, timeRemaining]);
  
  return analysis;
}