"use client";

import React from "react";
import { CreateBidForm } from "@/components/sections/createbidform";
import Link from "next/link";

export default function CreateBidPage() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-black p-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            Bidzy
          </Link>
          <div className="space-x-4">
            <Link 
              href="/your-bid" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8 mt-16">
          <CreateBidForm />
        </div>
      </div>
    </>
  );
}