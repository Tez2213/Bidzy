"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowRight,
} from "@tabler/icons-react";

type Bid = {
  id: string;
  title: string;
  budget: string;
  deadline: string;
  status: "published" | "draft";
  description: string;
  category: string;
};

export function YourBidsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"published" | "draft">(
    "published"
  );
  const [bids] = useState<Bid[]>([
    {
      id: "1",
      title: "Website Development Project",
      budget: "$5,000",
      deadline: "2024-03-30",
      status: "published",
      description:
        "Looking for a skilled developer to create a responsive website with modern design",
      category: "Web Development",
    },
    {
      id: "2",
      title: "Mobile App Design",
      budget: "$3,000",
      deadline: "2024-04-15",
      status: "draft",
      description:
        "Need a UI/UX designer for a mobile application with focus on user experience",
      category: "UI/UX Design",
    },
  ]);

  const handleCreateBid = () => {
    try {
      router.push("/createbid");
    } catch (error) {
      window.location.href = "/createbid";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Your Bids
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage your published and draft bids
            </p>
          </div>
            <button
            onClick={handleCreateBid}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
            <IconPlus className="h-5 w-5" />
            Create New Bid
            </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bids", value: "12" },
            { label: "Active Bids", value: "5" },
            { label: "Completed Bids", value: "3" },
            { label: "Draft Bids", value: "4" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
            >
              <p className="text-zinc-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-zinc-800 rounded-lg p-1 mb-6 max-w-xs">
          <button
            onClick={() => setActiveTab("published")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "published"
                ? "bg-blue-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "draft"
                ? "bg-blue-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Bids Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bids
            .filter((bid) => bid.status === activeTab)
            .map((bid) => (
              <div
                key={bid.id}
                className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:border-zinc-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="px-2 py-1 bg-zinc-700 rounded text-xs text-zinc-300">
                      {bid.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
                      <IconEdit className="h-4 w-4 text-zinc-400" />
                    </button>
                    <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
                      <IconTrash className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mt-3 mb-2">
                  {bid.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {bid.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-400 font-medium">
                    {bid.budget}
                  </span>
                  <span className="text-zinc-500">Due {bid.deadline}</span>
                </div>
                <button className="w-full mt-4 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded flex items-center justify-center gap-2 transition-colors">
                  View Details
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {bids.filter((bid) => bid.status === activeTab).length === 0 && (
          <div className="text-center py-12 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-white mb-2">
                No {activeTab} bids yet
              </h3>
              <p className="text-zinc-400 mb-4">
                Get started by creating your first bid
              </p>
              <button
                onClick={handleCreateBid}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mx-auto"
              >
                <IconPlus className="h-4 w-4" />
                Create New Bid
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
