"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BidCard } from "@/components/bid/BidCard";
import { FilterTabs } from "@/components/bid/FilterTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconLoader2,
  IconPlus,
  IconSearch,
  IconAlertTriangle,
} from "@tabler/icons-react";

export function YourBidsContent() {
  const router = useRouter();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState("all");
  const [counts, setCounts] = useState({
    all: 0,
    draft: 0,
    published: 0,
    active: 0,
    completed: 0,
  });

  useEffect(() => {
    async function fetchBids() {
      try {
        setLoading(true);
        // Add query parameters for filtering and sorting
        const queryParams = new URLSearchParams();
        if (activeTab !== "all") queryParams.append("status", activeTab);
        if (sortBy) queryParams.append("sort", sortBy);
        if (searchQuery) queryParams.append("search", searchQuery);

        const response = await fetch(`/api/bids/user?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }
        
        const data = await response.json();
        
        if (data.success) {
          setBids(data.bids || []);
          setCounts(data.counts || {
            all: 0,
            draft: 0,
            published: 0,
            active: 0,
            completed: 0,
          });
        } else {
          throw new Error(data.message || "Failed to load bids");
        }
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError("Failed to load your bids. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBids();
  }, [searchQuery, sortBy, activeTab]);

  const handleBidClick = (bid) => {
    // Navigate to bid details page
    router.push(`/bid/${bid.id}`);
  };

  const handleCreateBid = () => {
    router.push("/create-bid");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-center max-w-md">
          <IconAlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300 mb-2">Error</p>
          <p className="text-zinc-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">Your Bids</h1>
          <p className="text-zinc-400">Manage your shipping requests and track their status</p>
        </div>
        <Button 
          onClick={handleCreateBid}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <IconPlus className="h-4 w-4" /> Create Bid
        </Button>
      </div>

      {/* Filter tabs */}
      <FilterTabs 
        counts={counts} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />

      {/* Search and sort controls */}
      <div className="flex flex-wrap gap-4 my-6">
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
      </div>

      {/* Bids content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <IconLoader2 className="h-8 w-8 animate-spin text-zinc-500" />
            <p className="text-zinc-500">Loading your bids...</p>
          </div>
        </div>
      ) : bids.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h3 className="text-xl font-medium text-zinc-300 mb-2">No bids found</h3>
            <p className="text-zinc-500 mb-6">
              {activeTab === "all" 
                ? "You haven't created any bids yet. Create your first bid to get started."
                : `You don't have any ${activeTab} bids. ${
                    activeTab === "draft" 
                      ? "Create a new bid to get started." 
                      : ""
                  }`
              }
            </p>
            {(activeTab === "all" || activeTab === "draft") && (
              <Button 
                onClick={handleCreateBid} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Your First Bid
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bids.map((bid) => (
            <BidCard 
              key={bid.id} 
              bid={bid} 
              onClick={handleBidClick}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
