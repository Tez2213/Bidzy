"use client";

import React from "react";
import Link from "next/link";
import { SidebarDemo } from "@/components/sections/sidebarsection";

export default function HomePage() {
  return (
    <>
      <SidebarDemo activeLink="Home" />
      <Link href="/livebid" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
        Go to Live Auction
      </Link>
    </>
  );
}
