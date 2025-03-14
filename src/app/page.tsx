"use client";

import React, { useEffect, useState } from "react";
import { SpotlightPreview } from "@/components/sections/SpotlightPreview";
import { WobbleCardDemo } from "@/components/sections/WobbleCardDemo";
import { BackgroundBeamsDemo } from "@/components/sections/BackgroundBeamsDemo";
import { GlobeDemo } from "@/components/sections/githubglobe";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CozeChat from "@/components/CozeChat";

export default function Home() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Generate a unique session ID when the component mounts
    const uniqueId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(uniqueId);
  }, []);

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
      {sessionId && <CozeChat projectId={`landing_${sessionId}`} />}
    </>
  );
}
