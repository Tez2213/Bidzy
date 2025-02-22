"use client";

import React from "react";
import { SidebarDemo } from "@/components/sections/sidebarsection";

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-black">
      <div className="flex h-screen">
        <SidebarDemo activeLink="Profile" />
      </div>
    </div>
  );
}