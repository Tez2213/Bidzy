"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconUser, IconEdit, IconInfoCircle } from "@tabler/icons-react";

// Demo user data
const demoUser = {
  name: "William Hawkings",
  email: "william9987@gmail.com",
  createdAt: "2024-11-01",
  activeBids: 3,
  successfulBids: 10,
  totalProjects: 13,
};

export function ProfileContent() {
  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-blue-800/30 border-4 border-blue-500/50 flex items-center justify-center">
                  <IconUser className="h-12 w-12 text-blue-300" />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <IconEdit className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {demoUser.name}
                </h1>
                <p className="text-blue-300 mt-1">{demoUser.email}</p>
                <div className="mt-4">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => console.log("Edit profile")}
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-700/20 border border-zinc-700/50 rounded-lg p-5">
                <h3 className="text-lg font-medium text-blue-400 mb-4">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-zinc-400">Name</p>
                    <p className="text-white">{demoUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p className="text-white">{demoUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Member Since</p>
                    <p className="text-white">
                      {new Date(demoUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-700/20 border border-zinc-700/50 rounded-lg p-5">
                <h3 className="text-lg font-medium text-blue-400 mb-4">
                  Account Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-zinc-400">Active Bids</p>
                    <p className="text-white font-medium">{demoUser.activeBids}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-zinc-400">Successful Bids</p>
                    <p className="text-white font-medium">{demoUser.successfulBids}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-zinc-400">Total Projects</p>
                    <p className="text-white font-medium">{demoUser.totalProjects}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-900/10 border border-blue-800/30 rounded-lg p-4">
              <div className="flex items-start">
                <IconInfoCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  Your profile information is used to personalize your experience and may be visible to other users when you participate in bidding activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}