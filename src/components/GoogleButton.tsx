"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Most direct approach possible
      window.location.href = "/api/auth/signin/google";
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="flex items-center justify-center w-full px-4 py-3 mt-2 border border-zinc-600 rounded-lg text-white hover:bg-zinc-800 transition-all"
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
      ) : (
        <IconBrandGoogle className="w-5 h-5 mr-2" />
      )}
      {isLoading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
