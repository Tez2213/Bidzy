// src/components/ClientLiveBid.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";

// Move the dynamic import to this client component
const LiveBidComponent = dynamic(
  () => import("@/components/sections/LiveBidComponent"),
  { ssr: false }
);

interface BidData {
  auctionId: string;
  initialTimeRemaining: number;
  startingBid: number;
  minimumIncrement: number;
}

export default function ClientLiveBid({ bidData }: { bidData: BidData }) {
  return <LiveBidComponent {...bidData} />;
}
