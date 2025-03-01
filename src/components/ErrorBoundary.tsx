'use client';
 
import { useEffect } from 'react';
 
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);
 
  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl text-red-400 font-bold mb-4">Something went wrong</h2>
        <p className="text-zinc-300 mb-6">
          We encountered an error loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}