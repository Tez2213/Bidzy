"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Gauge, DollarSign, ArrowDownCircle, Timer, AlertCircle, PiggyBank } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface BidPreferencesData {
  isAIEnabled: boolean;
  minAcceptablePrice: number;
  maxBidLimit: number;
  desiredProfitMargin: number;
  riskTolerance: 'low' | 'medium' | 'high';
  bidAggressiveness: number;
  autoBidFrequency: 'low' | 'medium' | 'high';
}

interface BidPreferencesProps {
  initialPreferences: BidPreferencesData;
  onUpdate: (preferences: BidPreferencesData) => void;
  itemStartingPrice: number;
}

export function BidPreferences({ 
  initialPreferences, 
  onUpdate,
  itemStartingPrice
}: BidPreferencesProps) {
  const [preferences, setPreferences] = useState<BidPreferencesData>(initialPreferences);
  const [riskToleranceValue, setRiskToleranceValue] = useState<string>(initialPreferences.riskTolerance);
  const [bidFrequencyValue, setBidFrequencyValue] = useState<string>(initialPreferences.autoBidFrequency);

  const handleChange = (change: Partial<BidPreferencesData>) => {
    const updated = { ...preferences, ...change };
    setPreferences(updated);
    onUpdate(updated);
  };

  // Fixed handlers for dropdown selections
  const handleRiskToleranceChange = (value: string) => {
    setRiskToleranceValue(value);
    handleChange({ riskTolerance: value as 'low' | 'medium' | 'high' });
  };

  const handleBidFrequencyChange = (value: string) => {
    setBidFrequencyValue(value);
    handleChange({ autoBidFrequency: value as 'low' | 'medium' | 'high' });
  };

  return (
    <Card className="border-0 bg-zinc-800/95 text-zinc-100 shadow-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-zinc-800/70 border-b border-zinc-700/50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-zinc-100">
            <Bot size={18} className="text-indigo-400" />
            AI Bidding Assistant
          </span>
          <Switch 
            checked={preferences.isAIEnabled} 
            onCheckedChange={(checked) => handleChange({ isAIEnabled: checked })}
            className="data-[state=checked]:bg-indigo-500" 
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 px-5">
        {preferences.isAIEnabled ? (
          <div className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-zinc-300">
                  <PiggyBank size={14} className="text-emerald-400" />
                  Minimum Acceptable Price ($)
                </label>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    value={preferences.minAcceptablePrice}
                    onChange={(e) => handleChange({ 
                      minAcceptablePrice: parseFloat(e.target.value) || 0 
                    })}
                    min={0}
                    step={0.01}
                    className="bg-zinc-700 border-zinc-600 text-zinc-200"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  The AI will not bid below this price (can be set to 0)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-zinc-300">
                    <ArrowDownCircle size={14} className="text-amber-400" />
                    Bid Aggressiveness
                  </label>
                  <span className="text-sm font-semibold text-amber-400">
                    {preferences.bidAggressiveness < 30 ? 'Conservative' : 
                     preferences.bidAggressiveness < 70 ? 'Moderate' : 'Aggressive'}
                  </span>
                </div>
                <Slider
                  value={[preferences.bidAggressiveness]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleChange({ bidAggressiveness: value })}
                  className="py-1"
                />
                <p className="text-xs text-zinc-500">
                  How aggressively the AI will decrease bids
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-zinc-300">
                    <DollarSign size={14} className="text-blue-400" />
                    Profit Margin Target
                  </label>
                  <span className="text-sm font-semibold text-blue-400">{preferences.desiredProfitMargin}%</span>
                </div>
                <Slider
                  value={[preferences.desiredProfitMargin]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([value]) => handleChange({ desiredProfitMargin: value })}
                  className="py-1"
                />
                <p className="text-xs text-zinc-500">
                  AI will try to maintain this profit margin when possible
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fixed Risk Tolerance selector with custom implementation */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-zinc-300">
                  <Gauge size={14} className="text-purple-400" />
                  Risk Tolerance
                </label>
                
                <div className="relative">
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      type="button"
                      onClick={() => handleRiskToleranceChange('low')}
                      variant={riskToleranceValue === 'low' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${riskToleranceValue === 'low' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Conservative
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleRiskToleranceChange('medium')}
                      variant={riskToleranceValue === 'medium' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${riskToleranceValue === 'medium' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Balanced
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleRiskToleranceChange('high')}
                      variant={riskToleranceValue === 'high' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${riskToleranceValue === 'high' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Aggressive
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500">
                  Higher risk = potentially lower bids
                </p>
              </div>

              {/* Fixed Bid Frequency selector with custom implementation */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1.5 text-zinc-300">
                  <Timer size={14} className="text-indigo-400" />
                  Bid Frequency
                </label>
                
                <div className="relative">
                  <div className="grid grid-cols-3 gap-1">
                    <Button 
                      type="button"
                      onClick={() => handleBidFrequencyChange('low')}
                      variant={bidFrequencyValue === 'low' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${bidFrequencyValue === 'low' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Infrequent
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleBidFrequencyChange('medium')}
                      variant={bidFrequencyValue === 'medium' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${bidFrequencyValue === 'medium' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Moderate
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => handleBidFrequencyChange('high')}
                      variant={bidFrequencyValue === 'high' ? 'default' : 'outline'}
                      className={`text-xs py-2 ${bidFrequencyValue === 'high' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                      Frequent
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500">
                  How often the AI should place bids
                </p>
              </div>
            </div>
            
            {/* AI Bidding Alert/Info */}
            <div className="bg-zinc-700/40 rounded-lg p-3 border border-zinc-600/40 mt-2">
              <div className="flex items-start">
                <AlertCircle size={16} className="text-amber-400 mr-2 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The AI will adjust its bidding strategy based on these settings and market conditions. 
                  It will never bid below your minimum acceptable price and will react to competing bids automatically.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bot size={40} className="text-zinc-600 mb-3" />
            <h3 className="text-zinc-300 font-medium mb-2">AI Bidding is Disabled</h3>
            <p className="text-sm text-zinc-500 max-w-xs">
              Enable the AI assistant to automatically place competitive bids on your behalf based on your preferences.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}