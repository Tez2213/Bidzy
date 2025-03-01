"use client";

import React from "react";
import { CreateBidForm } from "@/components/sections/createbidform";


export default function CreateBidPage() {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <CreateBidForm />
        </div>
      </div>
    </>
  );
}