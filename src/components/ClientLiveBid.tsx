// src/components/ClientLiveBid.tsx
"use client";

import React from "react";

interface BidData {
  auctionId: string;
  initialTimeRemaining: number;
  startingBid: number;
  minimumIncrement: number;
}

export default function ClientLiveBid({ bidData }: { bidData: any }) {
  return (
    <div className="p-6 bg-zinc-800 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Live Bid Preview</h2>
      <p className="text-zinc-300">This is a client-side component.</p>
      {bidData && (
        <pre className="mt-4 p-3 bg-zinc-900 rounded text-sm text-zinc-400 overflow-auto">
          {JSON.stringify(bidData, null, 2)}
        </pre>
      )}
    </div>
  );
}
