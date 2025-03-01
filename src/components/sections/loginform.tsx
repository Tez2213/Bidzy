"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGoogle,
  IconMail,
  IconLock,
  IconLogin,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginFormDemo() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Invalid email or password. Try test@example.com / password");
        setIsLoading(false);
        return;
      }

      // Redirect to home page
      router.push("/home");
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/90 rounded-xl shadow-xl backdrop-blur-sm p-6 sm:p-8 border border-zinc-800">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-zinc-400 mt-1">Sign in to continue to Bidzy</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-zinc-300 text-sm font-medium"
            >
              Email Address
            </Label>
            <div className="relative">
              <IconMail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-zinc-300 text-sm font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <IconLock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white pl-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-400 px-1">
          For demo: use test@example.com / password
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <IconLogin className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-900 text-zinc-500">
              or continue with
            </span>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-750 text-white font-medium rounded-lg border border-zinc-700 transition-colors"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <IconBrandGoogle className="h-5 w-5" />
          <span>Google</span>
        </button>
        <p className="text-center text-sm text-neutral-400 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/Sign-Up" className="text-blue-400 hover:text-blue-500">
            Sign up
          </a>
        </p>

  
      </form>
    </div>
  );
}
