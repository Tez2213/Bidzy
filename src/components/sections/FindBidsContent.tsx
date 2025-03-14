"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BidDetailsDialog } from "@/components/ui/BidDetailsDialog";
import Image from "next/image";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconMapPin,
  IconCalendarEvent,
  IconPackage,
  IconLoader2,
  IconAlertCircle,
  IconSortAscending,
  IconSortDescending,
  IconCoins,
} from "@tabler/icons-react";

// Bottom gradient effect for cards
const BottomGradient = () => {
  return (
    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30" />
  );
};

interface Bid {
  id: string;
  userId: string;
  title: string;
  description: string;
  itemCategory: string;
  originLocation: string;
  destinationLocation: string;
  packageWeight: number;
  packageDimensions: {
    length: number;
    width: number;
    height: number;
  };
  fragile: boolean;
  maxBudget: number;
  requiredDeliveryDate: string;
  insurance: boolean;
  status: string;
  imageUrls: string[];
  responses: number;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

export function FindBidsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "budget-high" | "budget-low">("newest");
  const [locationFilter, setLocationFilter] = useState("");
  const [maxResults, setMaxResults] = useState(50);
  
  // Categories
  const categories = [
    "all",
    "electronics",
    "furniture",
    "documents",
    "clothing",
    "fragile",
    "perishable",
    "other"
  ];

  // Fetch bids
  useEffect(() => {
    async function fetchBids() {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you'd include query params for filtering
        const response = await fetch("/api/bids/published");
        
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }
        
        const data = await response.json();
        setBids(data.bids);
      } catch (err: any) {
        console.error("Error fetching bids:", err);
        setError(err.message || "An error occurred while fetching bids");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBids();
  }, []);
  
  // Filter and sort bids
  const filteredBids = bids
    .filter(bid => {
      // Search filter
      if (searchQuery && !bid.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !bid.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "all" && bid.itemCategory !== selectedCategory) {
        return false;
      }
      
      // Price range filter
      if (bid.maxBudget < priceRange[0] || bid.maxBudget > priceRange[1]) {
        return false;
      }
      
      // Location filter
      if (locationFilter && 
          !bid.originLocation.toLowerCase().includes(locationFilter.toLowerCase()) && 
          !bid.destinationLocation.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "budget-high":
          return b.maxBudget - a.maxBudget;
        case "budget-low":
          return a.maxBudget - b.maxBudget;
        default:
          return 0;
      }
    })
    .slice(0, maxResults);
  
  const handleBidClick = (bid: Bid) => {
    setSelectedBid(bid);
    setDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  
  return (
    <div className="bg-black min-h-screen p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Find Shipping Jobs</h1>
        <p className="text-zinc-400">Browse available shipping requests and submit your bid</p>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Input
              placeholder="Search shipping jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white pl-10"
            />
            <IconSearch className="absolute left-3 top-2.5 text-zinc-500 h-5 w-5" />
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <IconX size={18} />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className={`border-zinc-800 ${filterOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <IconFilter size={18} className="mr-2" />
            Filters
          </Button>
          
          <Select 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as any)}
          >
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="newest">
                <div className="flex items-center">
                  <IconSortDescending size={16} className="mr-2" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center">
                  <IconSortAscending size={16} className="mr-2" />
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="budget-high">
                <div className="flex items-center">
                  <IconSortDescending size={16} className="mr-2" />
                  Highest Budget
                </div>
              </SelectItem>
              <SelectItem value="budget-low">
                <div className="flex items-center">
                  <IconSortAscending size={16} className="mr-2" />
                  Lowest Budget
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filter panel */}
        {filterOpen && (
          <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-zinc-400 block mb-2">Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-zinc-400 block mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  defaultValue={[0, 5000]}
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>
              
              <div>
                <label className="text-sm text-zinc-400 block mb-2">Location</label>
                <Input
                  placeholder="Origin or destination"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2 border-zinc-700 text-zinc-400 hover:text-white"
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 5000]);
                  setLocationFilter("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bids list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <IconLoader2 size={36} className="animate-spin text-blue-500 mb-4" />
          <p className="text-zinc-400">Loading shipping jobs...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <IconAlertCircle size={36} className="text-red-500 mb-4" />
          <p className="text-zinc-300 mb-2">Failed to load shipping jobs</p>
          <p className="text-zinc-500 text-sm">{error}</p>
          <Button 
            variant="outline"
            className="mt-4 border-zinc-700 text-zinc-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredBids.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <IconPackage size={36} className="text-zinc-600 mb-4" />
          <p className="text-zinc-300 mb-2">No shipping jobs found</p>
          <p className="text-zinc-500 text-sm">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBids.map((bid) => (
            <div 
              key={bid.id}
              className="relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all cursor-pointer"
              onClick={() => handleBidClick(bid)}
            >
              <div className="h-40 relative">
                {bid.imageUrls && bid.imageUrls.length > 0 ? (
                  <Image 
                    src={bid.imageUrls[0]} 
                    alt={bid.title} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <IconPackage size={48} className="text-zinc-700" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-zinc-800/70 backdrop-blur-sm text-white border-none">
                    {bid.itemCategory}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white line-clamp-1">{bid.title}</h3>
                  <div className="text-green-500 font-semibold">${bid.maxBudget.toFixed(2)}</div>
                </div>
                
                <div className="text-sm text-zinc-400 mb-3 line-clamp-2">{bid.description}</div>
                
                <div className="flex items-center mb-2 text-xs text-zinc-500">
                  <IconMapPin size={14} className="mr-1" />
                  <span className="truncate">
                    {bid.originLocation} → {bid.destinationLocation}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-zinc-500">
                  <IconCalendarEvent size={14} className="mr-1" />
                  <span>Deliver by {formatDate(bid.requiredDeliveryDate)}</span>
                </div>
                
                <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center text-zinc-400 text-xs">
                    <IconCoins size={14} className="mr-1" />
                    <span>{bid.responses} responses</span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <BottomGradient />
            </div>
          ))}
        </div>
      )}
      
      {/* Load more button */}
      {!loading && !error && filteredBids.length > 0 && filteredBids.length < bids.length && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-zinc-800 text-zinc-400"
            onClick={() => setMaxResults(prev => prev + 20)}
          >
            Load More
          </Button>
        </div>
      )}
      
      {/* Bid details dialog */}
      <BidDetailsDialog 
        bid={selectedBid}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBid(null);
        }}
      />
    </div>
  );
}