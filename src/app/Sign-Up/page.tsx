"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className="bg-zinc-900 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-input bg-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Create an Account
          </h2>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <Link
              href="/home"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </Link>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
