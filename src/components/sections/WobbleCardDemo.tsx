"use client";
import Image from "next/image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="w-full py-20 bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full p-4">
        {/* First Card - Large Pink */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]">
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Real-Time Auctions
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
            Stay engaged with live bidding.
            </p>
          </div>
          {/* Replace image with div for now */}
          <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl" />
        </WobbleCard>

        {/* Second Card - Medium Blue */}
        <WobbleCard containerClassName="col-span-1 bg-blue-800 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Best Deals Guaranteed 
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Bid smart, save big.
          </p>
        </WobbleCard>

        {/* Third Card - Medium Purple */}
        <WobbleCard containerClassName="col-span-1 bg-purple-800 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          User-Friendly Experience
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
          Simple, fast, and accessible for everyone.
          </p>
        </WobbleCard>

        {/* Fourth Card - Large Green */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-emerald-800 min-h-[400px]">
          <div className="max-w-sm">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Fair & Competitive System
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
            No bots, no rigging—only fair play for every bidder.
            </p>
          </div>
          <Image
            src="/demo2.webp"
            width={500}
            height={500}
            alt="demo image"
            className="absolute -right-4 lg:-right-[30%] grayscale filter -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>

        {/* Fifth Card - Full Width Gradient */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-r from-indigo-800 to-purple-800 min-h-[500px] lg:min-h-[300px]">
          <div className="max-w-lg">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Secure Payments & Transactions
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
            Multiple payment options with end-to-end encryption
            </p>
          </div>
          <Image
            src="/demo3.webp"
            width={600}
            height={600}
            alt="demo image"
            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
          />
        </WobbleCard>
      </div>
    </div>
  );
}
