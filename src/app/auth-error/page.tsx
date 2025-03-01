"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

// Create a separate component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    setError(searchParams.get("error") || "Unknown error");
  }, [searchParams]);

  return (
    <div className="max-w-lg w-full bg-zinc-800 border border-zinc-700 rounded-xl p-8">
      <h1 className="text-2xl font-bold text-red-400 mb-2">
        Authentication Error
      </h1>
      <p className="text-zinc-400 mb-6">
        There was a problem with your sign-in attempt
      </p>

      <div className="bg-zinc-900 border border-red-900/50 rounded-lg p-4 mb-6">
        <p className="text-red-400 font-mono text-sm">{error}</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">
          Common Causes:
        </h2>
        <ul className="list-disc pl-5 text-zinc-400 space-y-1">
          <li>Missing or incorrect environment variables on the server</li>
          <li>Redirect URI mismatch in Google Cloud Console</li>
          <li>Account doesn't have permission to use this application</li>
          <li>Google sign-in was canceled</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Back to Login
        </Link>
        <Link
          href="/"
          className="w-full py-2 text-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

// Loading fallback
function ErrorSkeleton() {
  return (
    <div className="max-w-lg w-full bg-zinc-800 border border-zinc-700 rounded-xl p-8 animate-pulse">
      <div className="h-8 bg-zinc-700 rounded mb-6"></div>
      <div className="h-4 bg-zinc-700 rounded w-3/4 mb-6"></div>
      <div className="h-24 bg-zinc-700 rounded mb-6"></div>
      <div className="h-48 bg-zinc-700 rounded mb-6"></div>
      <div className="h-10 bg-zinc-700 rounded mb-3"></div>
      <div className="h-10 bg-zinc-700 rounded"></div>
    </div>
  );
}

// Main page component with Suspense
export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<ErrorSkeleton />}>
        <ErrorContent />
      </Suspense>

      <div className="mt-8 text-sm text-zinc-500">
        <p>If the problem persists, please contact support.</p>
      </div>
    </div>
  );
}
