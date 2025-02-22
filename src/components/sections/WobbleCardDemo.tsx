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
              Innovative AI Solutions
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Transforming ideas into reality with cutting-edge AI technology.
            </p>
          </div>
          {/* Replace image with div for now */}
          <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/20 to-transparent rounded-2xl" />
        </WobbleCard>

        {/* Second Card - Medium Blue */}
        <WobbleCard containerClassName="col-span-1 bg-blue-800 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Smart Analytics
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Data-driven insights to power your business decisions.
          </p>
        </WobbleCard>

        {/* Third Card - Medium Purple */}
        <WobbleCard containerClassName="col-span-1 bg-purple-800 min-h-[300px]">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Cloud Solutions
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Scalable and secure cloud infrastructure for your applications.
          </p>
        </WobbleCard>

        {/* Fourth Card - Large Green */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-2 bg-emerald-800 min-h-[400px]">
          <div className="max-w-sm">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Sustainable Technology
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Building eco-friendly solutions for a better tomorrow.
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
              Join Our Innovation Hub
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              Be part of the next generation of technology pioneers. Join our
              community of innovators and creators.
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
