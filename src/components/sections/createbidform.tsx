"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CreateBidForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    category: "",
    endDate: "",
    images: [] as File[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="bg-black/95 p-8 rounded-lg shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Create New Bid</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white">Item Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter item title"
              className="mt-1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-white">Category</Label>
            <select
              id="category"
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="collectibles">Collectibles</option>
              <option value="art">Art</option>
              <option value="vehicles">Vehicles</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="text-white">Starting Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter starting price"
              className="mt-1"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <textarea
              id="description"
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 min-h-[150px]"
              placeholder="Describe your item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images" className="text-white">Upload Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              className="mt-1"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, images: files });
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Create Bid
        </Button>
      </form>
    </div>
  );
}