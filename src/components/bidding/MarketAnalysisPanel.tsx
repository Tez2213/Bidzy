"use client";

import React from 'react';
import { useBidAnalysis } from '@/hooks/useBidAnalysis';
import { Bid } from '@/components/sections/EnhancedLiveBidComponent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Minus, Activity, Users, Zap, DollarSign, ChevronRight } from 'lucide-react';

interface MarketAnalysisPanelProps {
  leaderboard: Bid[];
  currentBid: number;
  timeRemaining: number;
}

export function MarketAnalysisPanel({
  leaderboard,
  currentBid,
  timeRemaining
}: MarketAnalysisPanelProps) {
  const analysis = useBidAnalysis(leaderboard, currentBid, timeRemaining);

  const getTrendIcon = () => {
    switch(analysis.marketTrend) {
      case 'rising': return <ArrowUp className="text-rose-500" />;
      case 'cooling': return <ArrowDown className="text-emerald-500" />;
      default: return <Minus className="text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch(analysis.marketTrend) {
      case 'rising': return 'text-rose-500';
      case 'cooling': return 'text-emerald-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border-zinc-700 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-zinc-700/50 bg-zinc-800/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-zinc-50">
          <Activity size={18} className="text-indigo-400" />
          Market Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 bg-zinc-800/40 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400 flex items-center gap-1">
                <Users size={14} className="text-indigo-400" />
                Competitors
              </span>
              <span className="font-medium text-zinc-50">{analysis.competitorCount}</span>
            </div>
            <div className="bg-zinc-700/50 rounded-full h-1.5 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" 
                style={{ width: `${Math.min(analysis.competitorCount * 10, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2 bg-zinc-800/40 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400 flex items-center gap-1">
                <Zap size={14} className="text-amber-400" />
                Activity
              </span>
              <span className="font-medium text-zinc-50">{analysis.bidFrequency.toFixed(1)} bids/min</span>
            </div>
            <div className="bg-zinc-700/50 rounded-full h-1.5 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                style={{ width: `${Math.min(analysis.bidFrequency * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-zinc-700/70 flex items-center justify-center">
              {getTrendIcon()}
            </span>
            <div>
              <span className="text-xs text-zinc-400">Market Trend</span>
              <p className={`font-medium ${getTrendColor()}`}>
                {analysis.marketTrend.charAt(0).toUpperCase() + analysis.marketTrend.slice(1)}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-zinc-600" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/40 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-emerald-400" />
              <span className="text-xs text-zinc-400">Est. Final Price</span>
            </div>
            <p className="font-semibold text-emerald-400">
              ${Math.round(analysis.estimatedFinalPrice)}
            </p>
          </div>

          <div className="bg-zinc-800/40 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <ChevronRight size={14} className="text-blue-400" />
              <span className="text-xs text-zinc-400">Avg. Increment</span>
            </div>
            <p className="font-semibold text-blue-400">
              ${analysis.averageBidIncrement.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 bg-zinc-800/40 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-zinc-400">AI Activity</span>
            <span className="font-medium text-zinc-50">{Math.round(analysis.aiActivity)}%</span>
          </div>
          <div className="bg-zinc-700/50 rounded-full h-1.5 w-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
              style={{ width: `${analysis.aiActivity}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
