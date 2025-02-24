"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function FindBidsContent() {
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

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Apply Filters
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
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden"
              >
                <div className="aspect-video bg-zinc-700" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Bid Item {idx + 1}</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Description of the item goes here. This is a brief overview.
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-zinc-400 text-sm">Current Bid</p>
                      <p className="text-green-500 font-semibold">$1,000</p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Place Bid
                    </Button>
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