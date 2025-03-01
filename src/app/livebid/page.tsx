import React from "react";
import Link from "next/link";

export default function LiveBidPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Live Bidding Coming Soon
      </h1>
      <p className="text-zinc-400 text-center mb-8">
        Our live bidding feature is under development. Please check back later.
      </p>
      <Link
        href="/"
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}
