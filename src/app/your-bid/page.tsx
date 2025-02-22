"use client";

import React from "react";
import { SidebarDemo } from "@/components/sections/sidebarsection";

export default function YourBidsPage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="flex h-screen">
        <SidebarDemo activeLink="Your Bids" />
      </div>
    </div>
  );
}