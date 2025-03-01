"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { ProfileContent } from "@/components/sections/ProfileContent";
import { ClientProvider } from "@/components/ClientProvider";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ClientProvider>
        <div className="bg-zinc-900 p-4 sm:p-8 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-800 rounded-xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-white">John Doe</h1>
                  <p className="text-zinc-400">john.doe@example.com</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    Member since Jan 2025
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
                    <div className="bg-zinc-700 rounded-lg p-3 text-center w-24">
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-xs text-zinc-400">Active Bids</p>
                    </div>
                    <div className="bg-zinc-700 rounded-lg p-3 text-center w-24">
                      <p className="text-2xl font-bold text-white">8</p>
                      <p className="text-xs text-zinc-400">Successful</p>
                    </div>
                    <div className="bg-zinc-700 rounded-lg p-3 text-center w-24">
                      <p className="text-2xl font-bold text-white">20</p>
                      <p className="text-xs text-zinc-400">Total Projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="border-b border-zinc-700 pb-3">
                    <p className="text-zinc-300">Placed a bid of $1,200</p>
                    <p className="text-sm text-zinc-500">
                      Project: Website Redesign • 2 days ago
                    </p>
                  </div>
                  <div className="border-b border-zinc-700 pb-3">
                    <p className="text-zinc-300">Won a project</p>
                    <p className="text-sm text-zinc-500">
                      Project: Logo Design • 1 week ago
                    </p>
                  </div>
                  <div className="border-b border-zinc-700 pb-3">
                    <p className="text-zinc-300">Placed a bid of $800</p>
                    <p className="text-sm text-zinc-500">
                      Project: Mobile App UI • 2 weeks ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Account Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500">Name</p>
                    <p className="text-zinc-300">John Doe</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="text-zinc-300">john.doe@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Member Since</p>
                    <p className="text-zinc-300">January 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientProvider>
    </>
  );
}
