"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { YourBidsContent } from "@/components/sections/YourBidsContent";

export default function YourBidPage() {
  const router = useRouter();

  return (
    <div>
      <SidebarDemo activeLink="Your Bids">
        <YourBidsContent />
      </SidebarDemo>
    </div>
  );
}