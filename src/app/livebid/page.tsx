import React from "react";
import ClientLiveBid from "@/components/ClientLiveBid";

export default function LiveBidPage() {
  // These values would typically come from your API or database
  const mockAuctionData = {
    auctionId: "auction-123",
    initialTimeRemaining: 180, // 30 minutes
    startingBid: 200,
    minimumIncrement: 15,
  };

  // Pass the mockAuctionData to your client component
  return <ClientLiveBid bidData={mockAuctionData} />;
}
