import React from "react";
import { EnhancedLiveBidComponent } from "@/components/sections/EnhancedLiveBidComponent";

export default function LiveBidPage() {
  return (
    <div className="min-h-scree n bg-gradient-to-b from-zinc-50 to-zinc-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Live Bidding</h1>
        
        <EnhancedLiveBidComponent 
          auctionId="demo-auction-123"
          initialTimeRemaining={60} // 5 minutes
          startingBid={1000}
          minimumDecrement={50}
          currentUserId="user123"
          currentUsername="Current User"
        />
      </div>
    </div>
  );
}
