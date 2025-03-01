"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({
    error: searchParams.get("error") || "Unknown error",
  });

  useEffect(() => {
    // Parse error from URL
    setErrorDetails({
      error: searchParams.get("error") || "Unknown error",
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">
          Authentication Error
        </h1>
        
        <div className="bg-zinc-700/50 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-white font-mono">Error: {errorDetails.error}</p>
        </div>
        
        <p className="text-zinc-300 mb-6">
          There was a problem signing you in. This could be due to:
          <ul className="list-disc text-left mt-2 pl-4 space-y-1">
            <li>Incorrect OAuth configuration</li>
            <li>Missing environment variables</li>
            <li>Invalid redirect URIs</li>
            <li>Server-side authentication issues</li>
          </ul>
        </p>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/login"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Return to Login
          </Link>
          <Link 
            href="/"
            className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-zinc-500">
        <p>If the problem persists, please contact support.</p>
      </div>
    </div>
  );
}