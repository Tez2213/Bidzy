import React from "react";
import dynamic from "next/dynamic";
import ClientLiveBid from "@/components/ClientLiveBid";

// Use dynamic import with ssr:false for the client component
const LiveBidComponent = dynamic(
  () => import("@/components/sections/LiveBidComponent"),
  { ssr: false }
);

export default function LiveBidPage() {
  // These values would typically come from your API or database
  const mockAuctionData = {
    auctionId: "auction-123",
    initialTimeRemaining: 180, // 30 minutes
    startingBid: 200,
    minimumIncrement: 15,
  };

  const bidData = {
    // Your bid data here
  };

  return <ClientLiveBid bidData={bidData} />;
}
