"use client";

import React, { useState } from "react";
import { IconEdit, IconCamera, IconBell, IconWallet, IconHistory, IconShield, IconHeart } from "@tabler/icons-react";

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-b from-zinc-800 to-zinc-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1">
                <div className="h-full w-full rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                  <IconCamera className="h-10 w-10 text-zinc-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg transition-all hover:scale-110">
                <IconEdit className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">John Doe</h2>
              <p className="text-zinc-400 mb-3">john.doe@example.com</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">Premium Member</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">Verified Bidder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'personal', icon: <IconEdit className="w-4 h-4" />, label: 'Personal Info' },
            { id: 'bidding', icon: <IconWallet className="w-4 h-4" />, label: 'Bidding & Payments' },
            { id: 'history', icon: <IconHistory className="w-4 h-4" />, label: 'Auction History' },
            { id: 'notifications', icon: <IconBell className="w-4 h-4" />, label: 'Notifications' },
            { id: 'security', icon: <IconShield className="w-4 h-4" />, label: 'Security' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'personal' && (
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        defaultValue="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Display Name</label>
                      <input
                        type="text"
                        className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        defaultValue="johndoe123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Bio</label>
                    <textarea
                      className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                      rows={4}
                      defaultValue="Passionate collector and auction enthusiast..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bidding' && (
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-6">Bidding & Payments</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400">Available Balance</span>
                      <span className="text-xl font-bold text-white">$2,500.00</span>
                    </div>
                    <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Add Funds
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-3">Payment Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-zinc-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <img src="/visa-icon.png" alt="Visa" className="h-6" />
                          </div>
                          <div>
                            <p className="text-white">•••• 4242</p>
                            <p className="text-zinc-400 text-sm">Expires 12/24</p>
                          </div>
                        </div>
                        <button className="text-zinc-400 hover:text-white">
                          <IconEdit className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="w-full p-3 border border-dashed border-zinc-600 rounded-lg text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                        + Add New Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Member Since</span>
                  <span className="text-white">Jan 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Auctions Won</span>
                  <span className="text-white">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Success Rate</span>
                  <span className="text-green-400">94%</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Watching</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 bg-zinc-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-zinc-700 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Vintage Watch #{item}</p>
                      <p className="text-zinc-400 text-xs">Ends in 2d 4h</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <IconHeart className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}