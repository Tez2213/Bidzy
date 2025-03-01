import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr:false for the client component
const LiveBidComponent = dynamic(
  () => import('@/components/sections/LiveBidComponent'),
  { ssr: false }
);

export default function LiveBidPage() {
  // These values would typically come from your API or database
  const mockAuctionData = {
    auctionId: "auction-123",
    initialTimeRemaining: 180, // 30 minutes
    startingBid: 200,
    minimumIncrement: 15
  };

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Live Auction: Premium Sports Memorabilia</h1>
        <p className="text-gray-600 mt-2">
          Bid in real-time on this exclusive collection item.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Product image would go here */}
          <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-4">
            <span className="text-gray-500">Product Image</span>
          </div>
          
          {/* Product details would go here */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-semibold text-lg mb-2">Product Description</h3>
            <p className="text-gray-600">
              This is a premium collectible item with historical significance.
              Authenticated and in excellent condition.
            </p>
          </div>
        </div>
        
        <div className="md:col-span-1">
          {/* Live Bid Component */}
          <LiveBidComponent 
            auctionId={mockAuctionData.auctionId}
            initialTimeRemaining={mockAuctionData.initialTimeRemaining}
            startingBid={mockAuctionData.startingBid}
            minimumIncrement={mockAuctionData.minimumIncrement}
          />
        </div>
      </div>
    </main>
  );
}