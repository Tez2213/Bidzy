"use client";

import React from "react";
import { SpotlightPreview } from "@/components/sections/SpotlightPreview";
import { WobbleCardDemo } from "@/components/sections/WobbleCardDemo";
import { BackgroundBeamsDemo } from "@/components/sections/BackgroundBeamsDemo";
import { GlobeDemo } from "@/components/sections/githubglobe";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CozeChat from "@/components/CozeChat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full relative overflow-x-hidden no-scrollbar">
        <div className="flex flex-col gap-0">
          <SpotlightPreview />
          <WobbleCardDemo />
          <GlobeDemo />
          <BackgroundBeamsDemo />
        </div>
      </main>
      <Footer />
      <CozeChat projectId="landing" />
    </>
  );
}
