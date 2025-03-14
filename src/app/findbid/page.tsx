"use client";

import React from "react";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { FindBidsContent } from "@/components/sections/FindBidsContent";

export default function FindBidPage() {
  return (
    <SidebarDemo activeLink="Find Bids">
      <FindBidsContent />
    </SidebarDemo>
  );
}