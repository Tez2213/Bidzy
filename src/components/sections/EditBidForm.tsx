"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  IconCalendar,
  IconPackage,
  IconTruck,
  IconCategory,
  IconCurrencyDollar,
} from "@tabler/icons-react";

type Bid = {
  id: string;
  title: string;
  description: string;
  itemCategory: string;
  originLocation: string;
  destinationLocation: string;
  packageWeight: number;
  packageDimensions: {
    length: number;
    width: number;
    height: number;
  };
  fragile: boolean;
  maxBudget: number;
  requiredDeliveryDate: string;
  status: string;
  images: string[];
};

export function EditBidForm({ bidId }: { bidId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<Bid>({
    id: "",
    title: "",
    description: "",
    itemCategory: "",
    originLocation: "",
    destinationLocation: "",
    packageWeight: 0,
    packageDimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    fragile: false,
    maxBudget: 0,
    requiredDeliveryDate: "",
    status: "draft",
    images: [],
  });

  // Fetch the bid data
  useEffect(() => {
    const fetchBid = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/bids/${bidId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch bid");
        }

        const data = await response.json();

        // Format the date to YYYY-MM-DD for the input
        const dateObj = new Date(data.requiredDeliveryDate);
        const formattedDate = dateObj.toISOString().split("T")[0];

        setFormData({
          ...data,
          requiredDeliveryDate: formattedDate,
        });
      } catch (err) {
        console.error("Error fetching bid:", err);
        setError("Failed to load bid data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBid();
  }, [bidId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Bid] as any),
          [child]: type === "number" ? parseFloat(value) : value,
        },
      });
    } else if ((e.target as HTMLInputElement).type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Handle image uploads if needed
      // In a real app, you would upload new images and get their URLs

      const response = await fetch(`/api/bids/${bidId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          saveAsDraft,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bid");
      }

      setShowSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/your-bid");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error updating bid:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !formData.id) {
    return (
      <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-zinc-900/80 backdrop-blur-sm mt-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="font-semibold text-red-400">Error</h3>
          <p className="text-sm text-neutral-300 mt-1">{error}</p>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => router.push("/your-bid")}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Back to Bids
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-zinc-900/80 backdrop-blur-sm mt-6">
      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <h4 className="text-green-400 font-medium text-lg">
            Bid updated successfully!
          </h4>
          <p className="text-neutral-300 text-sm mt-1">
            Redirecting to your bids...
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
          <h4 className="text-red-400 font-medium">Error</h4>
          <p className="text-neutral-300 text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-bold text-3xl bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          Edit Shipping Request
        </h2>
        <p className="text-neutral-400 text-sm mt-2">
          Update the details of your shipping request
        </p>
      </div>

      <form className="space-y-8" onSubmit={(e) => handleSubmit(e, false)}>
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <IconPackage className="h-5 w-5 text-blue-500" />
            Basic Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-neutral-200">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Shipping Electronics from New York to Los Angeles"
              className="bg-zinc-800 border-zinc-700 text-neutral-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-neutral-200">
              Description *
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about your shipping request..."
              rows={4}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCategory" className="text-neutral-200">
              Item Category *
            </Label>
            <select
              id="itemCategory"
              name="itemCategory"
              value={formData.itemCategory}
              onChange={handleChange}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-neutral-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="documents">Documents</option>
              <option value="food">Food & Perishables</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <IconTruck className="h-5 w-5 text-blue-500" />
            Shipping Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originLocation" className="text-neutral-200">
                Origin Location *
              </Label>
              <Input
                id="originLocation"
                name="originLocation"
                value={formData.originLocation}
                onChange={handleChange}
                placeholder="e.g. New York, NY"
                className="bg-zinc-800 border-zinc-700 text-neutral-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationLocation" className="text-neutral-200">
                Destination Location *
              </Label>
              <Input
                id="destinationLocation"
                name="destinationLocation"
                value={formData.destinationLocation}
                onChange={handleChange}
                placeholder="e.g. Los Angeles, CA"
                className="bg-zinc-800 border-zinc-700 text-neutral-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageWeight" className="text-neutral-200">
              Package Weight (kg) *
            </Label>
            <Input
              id="packageWeight"
              name="packageWeight"
              type="number"
              min="0"
              step="0.1"
              value={formData.packageWeight}
              onChange={handleChange}
              placeholder="e.g. 10.5"
              className="bg-zinc-800 border-zinc-700 text-neutral-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-200">
              Package Dimensions (cm) *
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Input
                  id="packageDimensions.length"
                  name="packageDimensions.length"
                  type="number"
                  min="0"
                  value={formData.packageDimensions.length}
                  onChange={handleChange}
                  placeholder="Length"
                  className="bg-zinc-800 border-zinc-700 text-neutral-200"
                  required
                />
              </div>
              <div>
                <Input
                  id="packageDimensions.width"
                  name="packageDimensions.width"
                  type="number"
                  min="0"
                  value={formData.packageDimensions.width}
                  onChange={handleChange}
                  placeholder="Width"
                  className="bg-zinc-800 border-zinc-700 text-neutral-200"
                  required
                />
              </div>
              <div>
                <Input
                  id="packageDimensions.height"
                  name="packageDimensions.height"
                  type="number"
                  min="0"
                  value={formData.packageDimensions.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className="bg-zinc-800 border-zinc-700 text-neutral-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fragile"
              name="fragile"
              checked={formData.fragile}
              onChange={handleChange}
              className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
            />
            <Label htmlFor="fragile" className="text-neutral-200">
              This package contains fragile items
            </Label>
          </div>
        </div>

        {/* Budget and Deadline */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <IconCurrencyDollar className="h-5 w-5 text-blue-500" />
            Budget and Deadline
          </h3>

          <div className="space-y-2">
            <Label htmlFor="maxBudget" className="text-neutral-200">
              Maximum Budget (USD) *
            </Label>
            <Input
              id="maxBudget"
              name="maxBudget"
              type="number"
              min="0"
              step="0.01"
              value={formData.maxBudget}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="bg-zinc-800 border-zinc-700 text-neutral-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredDeliveryDate" className="text-neutral-200">
              Required Delivery Date *
            </Label>
            <div className="relative">
              <Input
                id="requiredDeliveryDate"
                name="requiredDeliveryDate"
                type="date"
                value={formData.requiredDeliveryDate}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-neutral-200"
                required
              />
              <IconCalendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-6 text-neutral-200 border-zinc-700 hover:bg-zinc-800"
            onClick={() => router.push("/your-bid")}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Update Shipping Request"
            )}
          </Button>

          <Button
            type="button"
            onClick={(e) => handleSubmit(e as React.FormEvent, true)}
            className="flex-1 py-6 bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
            disabled={isLoading}
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
