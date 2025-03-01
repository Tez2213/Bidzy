"use client";

import React from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { EditBidForm } from "@/components/sections/EditBidForm";
import { SidebarDemo } from "@/components/sections/sidebarsection";

export default function EditBidPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <SidebarDemo activeLink="Your Bids">
        <EditBidForm bidId={params.id} />
      </SidebarDemo>
    </AuthGuard>
  );
}