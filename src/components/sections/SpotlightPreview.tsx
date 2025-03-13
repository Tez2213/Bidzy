/* filepath: /c:/Users/HP/OneDrive/Desktop/New bid/bidzy/src/components/sections/SpotlightPreview.tsx */
"use client";
import React from "react";
import { Spotlight } from "../ui/spotlight";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function SpotlightPreview() {
  return (
    <div className="min-h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white bg-grid relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Bidzy <br /> Smart Bidding, Smarter Deals!
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        Get the best deals through real-time smart bidding. 
        </p>

        {/* Login Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={()=> signIn("google")}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 ease-in-out rounded-full outline-none hover:text-black"
          >
            <span className="absolute inset-0 w-full h-full bg-white/10 border border-white/30 rounded-full group-hover:bg-white transition-all duration-200 ease-in-out"></span>
            <span className="relative">Get Started</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
