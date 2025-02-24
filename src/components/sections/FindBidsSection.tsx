"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Bid {
  id: number;
  title: string;
  description: string;
  currentBid: number;
  timeLeft: string;
  imageUrl: string;
}

export function FindBidsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Art",
    "Collectibles",
    "Vehicles"
  ];

  const dummyBids: Bid[] = [
    {
      id: 1,
      title: "Vintage Camera",
      description: "A rare vintage camera in excellent condition",
      currentBid: 500,
      timeLeft: "2d 5h",
      imageUrl: "/placeholder.jpg"
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {/* Filter Sidebar */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-6">Filters</h2>
          
          {/* Categories */}
          <div className="space-y-4 mb-6">
            <Label className="text-white">Category</Label>
            <select 
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-2 text-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label className="text-white">Price Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min"
                className="bg-zinc-700 border-zinc-600 text-white"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Max"
                className="bg-zinc-700 border-zinc-600 text-white"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          <Button 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Bids Grid */}
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Available Bids</h1>
          <select className="bg-zinc-700 border border-zinc-600 rounded-md p-2 text-white">
            <option value="newest">Newest First</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dummyBids.map((bid) => (
            <div 
              key={bid.id}
              className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden hover:border-zinc-600 transition-colors"
            >
              <div className="aspect-video bg-zinc-700 relative">
                {/* Add Image component here when available */}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{bid.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{bid.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-zinc-400 text-sm">Current Bid</p>
                    <p className="text-green-500 font-semibold">${bid.currentBid}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">Time Left</p>
                    <p className="text-yellow-500">{bid.timeLeft}</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Place Bid
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}