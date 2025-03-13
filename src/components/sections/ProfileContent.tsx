"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useUserBids } from '@/hooks/useUserBids';

export function ProfileContent() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    image: "",
    dob: "",
    walletAddress: "",
    paymentMethods: [] as string[],
    accountActivity: {
      totalBids: 0,
      activeBids: 0,
      wonBids: 0,
      lastActive: ""
    }
  });

  const bidStats = useUserBids();

  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || ""
      }));
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Add your image upload logic here
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        image: imageUrl
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex-1 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Existing image upload section */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-20 h-20">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="space-y-2">
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dob">Date of Birth</label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={profile.dob}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email">Email ID</label>
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
              </div>

              {/* Address and Payment Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address & Payment</h3>
                
                <div className="space-y-2">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full min-h-[80px] p-2 border rounded-md"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="walletAddress">Wallet Address</label>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    value={profile.walletAddress}
                    onChange={handleInputChange}
                    placeholder="0x..."
                  />
                </div>

                <div className="space-y-2">
                  <label>Payment Methods</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {/* Add payment method logic */}}
                    >
                      + Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Activity Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Account Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Bids</div>
                  <div className="text-2xl font-semibold">{bidStats.totalBids}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Active Bids</div>
                  <div className="text-2xl font-semibold">{bidStats.activeBids}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Won Bids</div>
                  <div className="text-2xl font-semibold">{bidStats.wonBids}</div>
                </div>
              </div>
              {bidStats.lastActive && (
                <div className="mt-4 text-sm text-gray-600">
                  Last Activity: {new Date(bidStats.lastActive).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex">
      <SidebarDemo activeLink="Profile" />
      <ProfileContent />
    </div>
  );
}