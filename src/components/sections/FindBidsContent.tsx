"use client";

import React, { useState, useEffect } from "react";
import { BidCard } from "@/components/bid/BidCard";
import { BidDetailModal } from "@/components/bid/BidDetailModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";

export function FindBidsContent() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedBid, setSelectedBid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBids() {
      try {
        setLoading(true);
        // Add query parameters for filtering and sorting
        const queryParams = new URLSearchParams();
        if (sortBy) queryParams.append("sort", sortBy);
        if (filterBy !== "all") queryParams.append("status", filterBy);
        if (searchQuery) queryParams.append("search", searchQuery);

        const response = await fetch(`/api/bids/published?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }
        
        const data = await response.json();
        
        // Ensure we have unique bids by ID
        const uniqueBids = [];
        const bidIds = new Set();
        
        if (Array.isArray(data.bids)) {
          data.bids.forEach(bid => {
            if (bid.id && !bidIds.has(bid.id)) {
              bidIds.add(bid.id);
              uniqueBids.push(bid);
            }
          });
        }
        
        setBids(uniqueBids);
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError("Failed to load available bids. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBids();
  }, [searchQuery, sortBy, filterBy]);

  const handleBidClick = (bid) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Optional: Refresh bids list after modal closes to reflect any changes
    // This could be optimized to only refresh when a payment was successful
    if (selectedBid) {
      const queryParams = new URLSearchParams();
      if (sortBy) queryParams.append("sort", sortBy);
      if (filterBy !== "all") queryParams.append("status", filterBy);
      if (searchQuery) queryParams.append("search", searchQuery);
      
      fetch(`/api/bids/published?${queryParams.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.bids)) {
            // Again, ensure uniqueness
            const uniqueBids = [];
            const bidIds = new Set();
            
            data.bids.forEach(bid => {
              if (bid.id && !bidIds.has(bid.id)) {
                bidIds.add(bid.id);
                uniqueBids.push(bid);
              }
            });
            
            setBids(uniqueBids);
          }
        });
    }
  };

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-center max-w-md">
          <p className="text-red-300 mb-2">Error</p>
          <p className="text-zinc-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-[80vh]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Find Shipping Jobs</h1>
          <p className="text-zinc-400">Browse available shipping requests from customers around the world.</p>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
            <Input
              placeholder="Search by title or location..."
              className="pl-10 bg-zinc-900 border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="budget_high">Budget (High to Low)</SelectItem>
              <SelectItem value="budget_low">Budget (Low to High)</SelectItem>
              <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="ground">Ground Shipping</SelectItem>
              <SelectItem value="air">Air Freight</SelectItem>
              <SelectItem value="sea">Sea Freight</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bids grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <IconLoader2 className="h-8 w-8 animate-spin text-zinc-500" />
              <p className="text-zinc-500">Loading available shipping jobs...</p>
            </div>
          </div>
        ) : bids.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <h3 className="text-xl font-medium text-zinc-300 mb-2">No shipping jobs found</h3>
              <p className="text-zinc-500">
                {searchQuery 
                  ? `No results match "${searchQuery}". Try different keywords or filters.` 
                  : "There are currently no shipping jobs available. Please check back later."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add key using bid.id to prevent duplicate renders */}
            {bids.map((bid) => (
              <BidCard 
                key={bid.id} 
                bid={bid} 
                onClick={handleBidClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedBid && (
        <BidDetailModal
          bid={selectedBid}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}