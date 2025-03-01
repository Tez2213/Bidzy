"use client";

import { ClientProvider } from "@/components/ClientProvider";
import { GoogleButton } from "@/components/GoogleButton";

export default function AuthTestPage() {
  return (
    <ClientProvider>
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-800 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Auth Test</h1>
          <p className="text-zinc-400 mb-6">Test Google authentication</p>

          <GoogleButton />

          <div className="mt-6 text-center text-sm text-zinc-500">
            <p>Click the button to test Google authentication</p>
          </div>
        </div>
      </div>
    </ClientProvider>
  );
}
