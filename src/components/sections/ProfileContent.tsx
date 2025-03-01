"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconUser, IconEdit, IconInfoCircle } from "@tabler/icons-react";

export function ProfileContent() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Error loading user data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <IconInfoCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl text-red-400 font-medium">
          Error Loading Profile
        </h3>
        <p className="text-zinc-400 mt-2">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-8">
        <IconUser className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
        <h3 className="text-xl text-zinc-400 font-medium">Not Signed In</h3>
        <p className="text-zinc-500 mt-2">
          Please sign in to view your profile
        </p>
      </div>
    );
  }

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
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-24 h-24 rounded-full border-4 border-blue-500/50 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-800/30 border-4 border-blue-500/50 flex items-center justify-center">
                    <IconUser className="h-12 w-12 text-blue-300" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <IconEdit className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {session.user?.name || "User"}
                </h1>
                <p className="text-blue-300 mt-1">{session.user?.email}</p>
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
                    <p className="text-white">
                      {session.user?.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p className="text-white">
                      {session.user?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Member Since</p>
                    <p className="text-white">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString()
                        : "Not available"}
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
                    <p className="text-white font-medium">
                      {userData?.activeBids || 0}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-zinc-400">Successful Bids</p>
                    <p className="text-white font-medium">
                      {userData?.successfulBids || 0}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-zinc-400">Total Projects</p>
                    <p className="text-white font-medium">
                      {userData?.totalProjects || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-900/10 border border-blue-800/30 rounded-lg p-4">
              <div className="flex items-start">
                <IconInfoCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-300">
                  Your profile information is used to personalize your
                  experience and may be visible to other users when you
                  participate in bidding activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
