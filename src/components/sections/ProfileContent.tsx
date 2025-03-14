"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useUserBids } from '@/hooks/useUserBids';
import SidebarDemo from '../SidebarDemo';
import { IconCamera, IconEdit, IconWallet, IconBox, IconClock, IconTrophy } from "@tabler/icons-react";
import { connectWallet } from '@/lib/blockchain/wallet';

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
  const [isEditing, setIsEditing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setWalletAddress(address);
        setProfile(prev => ({
          ...prev,
          walletAddress: address
        }));
      }
    };

    // Add event listeners for MetaMask account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setWalletAddress('');
        setProfile(prev => ({
          ...prev,
          walletAddress: ''
        }));
      } else {
        // User switched accounts
        setWalletAddress(accounts[0]);
        setProfile(prev => ({
          ...prev,
          walletAddress: accounts[0]
        }));
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    // Initial check
    checkWallet();

    // Add event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // Empty dependency array since we want this to run only once

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
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdateWallet = async (address: string) => {
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/user/update-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        walletAddress: address,
        userId: session.user.id 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update wallet address');
    }

    return response.json();
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      if (!session?.user) return;

      const address = await connectWallet();
      await updateUserWallet(address, session);
      setWalletAddress(address);
      setProfile(prev => ({
        ...prev,
        walletAddress: address
      }));
    } catch (error) {
      console.log('Wallet connection cancelled');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => setIsEditing(!isEditing)}
            className={`mt-4 md:mt-0 ${isEditing ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-900'}`}
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
            <IconEdit className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Image & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-zinc-800 to-black h-32 relative"></div>
                <div className="px-6 pb-6 pt-12 -mt-16 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800">
                      {profile.image ? (
                        <Image
                          src={profile.image}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-400">
                          {profile.name ? profile.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label 
                        htmlFor="image-upload" 
                        className="absolute bottom-0 right-0 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2 cursor-pointer border border-zinc-700 transition-colors"
                      >
                        <IconCamera className="h-4 w-4 text-white" />
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white mt-3">{profile.name || "User Name"}</h2>
                  <p className="text-zinc-400 text-sm">{profile.email || "email@example.com"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Activity Card */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Account Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-zinc-800 mr-3">
                        <IconBox className="h-5 w-5 text-zinc-300" />
                      </div>
                      <span className="text-zinc-300">Total Bids</span>
                    </div>
                    <span className="text-xl font-semibold text-white">{bidStats.totalBids}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-zinc-800 mr-3">
                        <IconClock className="h-5 w-5 text-zinc-300" />
                      </div>
                      <span className="text-zinc-300">Active Bids</span>
                    </div>
                    <span className="text-xl font-semibold text-white">{bidStats.activeBids}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-zinc-800 mr-3">
                        <IconTrophy className="h-5 w-5 text-zinc-300" />
                      </div>
                      <span className="text-zinc-300">Won Bids</span>
                    </div>
                    <span className="text-xl font-semibold text-white">{bidStats.wonBids}</span>
                  </div>
                </div>
                
                {bidStats.lastActive && (
                  <div className="mt-4 text-sm text-zinc-500 flex items-center">
                    <IconClock className="h-4 w-4 mr-1" />
                    Last Active: {new Date(bidStats.lastActive).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details Form */}
          <div className="lg:col-span-3">
            <Card className="bg-zinc-900 border-zinc-800 shadow-md">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6 pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-zinc-300 text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        disabled={!isEditing}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-zinc-300 text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        value={profile.email}
                        disabled
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dob" className="text-zinc-300 text-sm font-medium">
                        Date of Birth
                      </label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profile.dob}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-zinc-300 text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (234) 567-8900"
                        disabled={!isEditing}
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (234) 567-8900"
                        disabled={!isEditing}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700 focus-visible:ring-offset-zinc-900"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="bio" className="text-zinc-300 text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us a little about yourself..."
                        disabled={!isEditing}
                        className="w-full min-h-[80px] p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 my-6 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Address & Payment</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="address" className="text-zinc-300 text-sm font-medium">
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          placeholder="Enter your full address"
                          disabled={!isEditing}
                          className="w-full min-h-[80px] p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="walletAddress" className="text-zinc-300 text-sm font-medium flex items-center">
                          <IconWallet className="h-4 w-4 mr-1" />
                          Wallet Address
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="walletAddress"
                            name="walletAddress"
                            value={walletAddress || 'No wallet connected'}
                            disabled
                            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          />
                          <button
                            onClick={handleConnectWallet}
                            disabled={isLoading}
                            className={`shrink-0 px-3 py-2 rounded-md ${
                              walletAddress 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            } disabled:opacity-50 text-white flex items-center gap-2`}
                          >
                            <IconWallet size={16} />
                            {isLoading ? 'Connecting...' : walletAddress ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-zinc-300 text-sm font-medium">Payment Methods</label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            disabled={!isEditing}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-50"
                            onClick={() => {/* Add payment method logic */}}
                          >
                            + Add Payment Method
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                      <Button 
                        type="submit"
                        className="bg-zinc-800 hover:bg-zinc-700 text-white"
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export const updateUserWallet = async (walletAddress: string, session: any) => {
  try {
    const response = await fetch('/api/user/update-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update wallet address');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
};

export default function ProfilePage() {
  return (
    <div className="flex-1">
      <ProfileContent />
    </div>
  );
}