"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const BottomGradient = () => {
  return (
    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30" />
  );
};

export function FindBidsContent() {
  const activeBids = [
    {
      id: 1,
      title: "Vintage Table",
      currentBid: "$1,200",
      timeLeft: "2h 15m",
      image: "/Screenshot 2025-03-01 213838.png" // Add your image path
    },
    {
      id: 2,
      title: "Antique Bird Bead",
      currentBid: "$800",
      timeLeft: "5h 30m",
      image: "/Screenshot 2025-03-01 213903.png" // Add your image path
    },
    {
      id: 3,
      title: "Classic Bottle Records",
      currentBid: "$350",
      timeLeft: "1h 45m",
      image: "/Screenshot 2025-03-01 213927.png" // Add your image path
    },
    {
      id: 4,
      title: "Diamond Jewel",
      currentBid: "$2,500",
      timeLeft: "3h 20m",
      image: "/Screenshot 2025-03-01 213958.png" // Add your image path
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
            <h2 className="text-lg font-semibold text-white mb-6">Filters</h2>
            
            {/* Price Range */}
            <div className="space-y-4 mb-6">
              <h3 className="text-white font-medium">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="text-zinc-400">Min</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-zinc-400">Max</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4 mb-6">
              <h3 className="text-white font-medium">Categories</h3>
              <div className="space-y-2">
                {["Electronics", "Fashion", "Art", "Collectibles", "Vehicles"].map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-600 bg-zinc-700 text-blue-600"
                    />
                    <span className="text-zinc-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="relative w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors">
              Apply Filters
              <BottomGradient />
            </Button>
          </div>
        </div>

        {/* Bids Grid */}
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-white">Active Bids</h1>
            <select className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-300">
              <option value="newest">Newest First</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeBids.map((bid) => (
              <div
                key={bid.id}
                className="group relative rounded-lg overflow-hidden flex flex-col bg-zinc-800/50 border border-zinc-700/50"
              >
                <div className="h-[200px] bg-zinc-800 rounded-t-lg">
                  <Image
                    src={bid.image}
                    alt={bid.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-contain rounded-t-lg"
                    style={{
                      backgroundColor: '#27272a',
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2">{bid.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">
                      Current Bid: {bid.currentBid}
                    </span>
                    <span className="text-blue-400 text-sm">{bid.timeLeft} left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}