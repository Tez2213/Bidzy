"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SidebarDemo } from "@/components/sections/sidebarsection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconLoader2,
  IconEdit,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconMessageCircle,
} from "@tabler/icons-react";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    image: "",
    phone: "",
    address: "",
    bio: "",
    createdAt: "",
  });
  
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    bio: "",
  });

  // Fetch complete profile data
  useEffect(() => {
    async function fetchProfileData() {
      if (status === "authenticated" && session.user) {
        try {
          // Set basic profile data from session first
          setProfileData(prev => ({
            ...prev,
            id: session.user.id || "",
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || "",
          }));
          
          // Then fetch complete profile data from API
          const response = await fetch('/api/user/profile');
          
          if (response.ok) {
            const data = await response.json();
            setProfileData({
              id: data.user.id,
              name: data.user.name || "",
              email: data.user.email || "",
              image: data.user.image || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
              bio: data.user.bio || "",
              createdAt: data.user.createdAt,
            });
            
            setFormData({
              phone: data.user.phone || "",
              address: data.user.address || "",
              bio: data.user.bio || "",
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      } else if (status !== "loading") {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, [session, status]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile update
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      
      // Update profile data with new values
      setProfileData(prev => ({
        ...prev,
        phone: data.user.phone || "",
        address: data.user.address || "",
        bio: data.user.bio || "",
      }));
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
      
      // No redirection here, just staying on the profile page
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SidebarDemo activeLink="Profile">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <IconLoader2 className="w-12 h-12 animate-spin text-zinc-500" />
            <p className="text-zinc-400 text-lg">Loading profile data...</p>
          </div>
        </div>
      </SidebarDemo>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <SidebarDemo activeLink="Profile">
      <div className="p-4 md:p-6 bg-black text-white">
        <h1 className="text-2xl font-bold mb-8">Your Profile</h1>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl space-y-8">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-800">
              {profileData.image ? (
                <img 
                  src={profileData.image}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-zinc-800 text-zinc-400">
                  <IconUser size={32} />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-zinc-400">
                Member since {formatDate(profileData.createdAt)}
              </p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
              <p className="text-red-500 text-sm flex items-center">
                <IconAlertCircle className="h-4 w-4 mr-2" />
                {error}
              </p>
            </div>
          )}
          
          {/* Profile details or edit form */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Address
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="bg-zinc-800 border-zinc-700 text-white resize-none h-24"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IconCheck className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to current profile values
                    setFormData({
                      phone: profileData.phone || "",
                      address: profileData.address || "",
                      bio: profileData.bio || "",
                    });
                  }}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">Email</p>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <IconMail size={16} className="text-zinc-500" />
                    <p>{profileData.email || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">Phone</p>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <IconPhone size={16} className="text-zinc-500" />
                    <p>{profileData.phone || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-zinc-500">Address</p>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <IconMapPin size={16} className="text-zinc-500" />
                    <p>{profileData.address || "Not provided"}</p>
                  </div>
                </div>
                
                {profileData.bio && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-zinc-500">Bio</p>
                    <div className="flex gap-2 text-zinc-300">
                      <IconMessageCircle size={16} className="text-zinc-500 mt-1 flex-shrink-0" />
                      <p className="whitespace-pre-wrap">{profileData.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Profile actions */}
          {!isEditing && (
            <div className="pt-4 border-t border-zinc-800">
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <IconEdit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </SidebarDemo>
  );
}
