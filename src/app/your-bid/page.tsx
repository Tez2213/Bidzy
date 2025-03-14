"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { YourBidsContent } from "@/components/sections/YourBidsContent";

// Simple loading component
function BidsLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-lg">
          Preparing your bidding dashboard...
        </p>
      </div>
    </div>
  );
}

export default function YourBidPage() {
  const router = useRouter();

  return (
    <div>
      <SidebarDemo activeLink="Your Bids">
        <Suspense fallback={<BidsLoadingFallback />}>
          <YourBidsContent />
        </Suspense>
      </SidebarDemo>
    </div>
  );
}
