"use client";

import React from "react";
import { IconEdit, IconCamera } from "@tabler/icons-react";

export function ProfileContent() {
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-white mb-6">
          Profile
        </h1>

        {/* Profile Header */}
        <div className="bg-zinc-800 rounded-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-zinc-700 flex items-center justify-center">
                <IconCamera className="h-8 w-8 text-zinc-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-500 hover:bg-blue-600">
                <IconEdit className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-white">John Doe</h2>
              <p className="text-zinc-400">john.doe@example.com</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white"
                  defaultValue="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Language
                </label>
                <select className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Timezone
                </label>
                <select className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC+0 (London)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
