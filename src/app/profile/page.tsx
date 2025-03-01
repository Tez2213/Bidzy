"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { ProfileContent } from "@/components/sections/ProfileContent";
import { ClientProvider } from "@/components/ClientProvider";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ClientProvider>
        <ProfileContent />
      </ClientProvider>
    </>
  );
}
