import React from "react";

export default function LiveBidPage() {
  // These values would typically come from your API or database
  const mockAuctionData = {
    auctionId: "auction-123",
    initialTimeRemaining: 180, // 3 minutes
    startingBid: 200,
    minimumIncrement: 15,
  };

  return (
    <div className="p-8 bg-zinc-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Live Bidding</h1>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Auction #{mockAuctionData.auctionId}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-zinc-700 rounded-lg">
            <p className="text-sm text-zinc-400">Starting Bid</p>
            <p className="text-xl font-bold">${mockAuctionData.startingBid}</p>
          </div>
          <div className="p-4 bg-zinc-700 rounded-lg">
            <p className="text-sm text-zinc-400">Minimum Increment</p>
            <p className="text-xl font-bold">
              ${mockAuctionData.minimumIncrement}
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-zinc-400">
            Client-side bidding functionality is disabled in this static
            version.
          </p>
        </div>
      </div>
    </div>
  );
}
