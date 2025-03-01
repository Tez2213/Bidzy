"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import {
  IconMapPin,
  IconPackage,
  IconTruck,
  IconCalendar,
  IconPhoto,
  IconX,
  IconAlertCircle,
  IconClock,
  IconCheckbox,
} from "@tabler/icons-react";

// Add this new component for section headers
const SectionHeader = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-neutral-200">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-neutral-400 ml-10">{description}</p>
      )}
    </div>
  );
};

// Reusing the LabelInputContainer from your signupform
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex flex-col space-y-2 w-full ${className || ""}`}>
      {children}
    </div>
  );
};

// Bottom gradient effect from your signupform
const BottomGradient = () => {
  return (
    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30" />
  );
};

export function CreateBidForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    itemCategory: "electronics",
    originLocation: "",
    destinationLocation: "",
    packageWeight: "1",
    packageDimensions: {
      length: "10",
      width: "10",
      height: "10",
    },
    fragile: false,
    maxBudget: "100",
    requiredDeliveryDate: "",
    saveAsDraft: false,
    images: [] as File[],
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Update the handleSubmit function in CreateBidForm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a unique ID for the bid
      const bidId = `bid_${Date.now()}`;

      // Create bid object
      const bidData = {
        id: bidId,
        ...formData,
        status: formData.saveAsDraft ? 'draft' : 'active',
        createdAt: new Date().toISOString(),
        bids: [] // Array to store received bids
      };

      // Get existing bids from localStorage
      const existingBids = JSON.parse(localStorage.getItem('userBids') || '[]');
      
      // Add new bid
      const updatedBids = [...existingBids, bidData];
      
      // Save to localStorage
      localStorage.setItem('userBids', JSON.stringify(updatedBids));

      // Also save to available bids if not a draft
      if (!formData.saveAsDraft) {
        const existingAvailableBids = JSON.parse(localStorage.getItem('availableBids') || '[]');
        const updatedAvailableBids = [...existingAvailableBids, bidData];
        localStorage.setItem('availableBids', JSON.stringify(updatedAvailableBids));
      }

      // Show success message
      setShowSuccess(true);

      // Redirect after a delay
      setTimeout(() => {
        router.push("/your-bid");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to create bid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Update form data with the files
    setFormData({ ...formData, images: files });

    // Generate preview URLs
    const newImageUrls: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          newImageUrls.push(reader.result);
          if (newImageUrls.length === files.length) {
            setImagePreviewUrls(newImageUrls);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // Handle nested properties (like dimensions)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...((formData[parent as keyof typeof formData] as object) || {}),
          [child]: value,
        },
      });
      return;
    }

    // Handle simple properties
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-zinc-900/80 backdrop-blur-sm mt-6">
      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
          <h4 className="text-green-400 font-medium text-lg">
            {formData.saveAsDraft
              ? "Draft saved successfully!"
              : "Bid created successfully!"}
          </h4>
          <p className="text-neutral-300 text-sm mt-1">
            Redirecting you to your bids...
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
          Create Shipping Request
        </h2>
        <p className="text-neutral-400 text-sm mt-2">
          Fill in the details below to create a new shipping request and receive
          competitive bids from verified carriers.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconPackage className="h-5 w-5" />}
            title="Package Information"
            description="Provide detailed information about your shipment"
          />

          <div className="mb-8">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="title" className="text-neutral-200">
                Package Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Gaming PC for Shipping"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="description" className="text-neutral-200">
                Package Description
              </Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the item(s) you want to ship in detail..."
                value={formData.description}
                onChange={handleInputChange}
                className="rounded-md bg-zinc-800 border border-zinc-700 text-neutral-200 placeholder:text-neutral-500 p-2"
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="itemCategory" className="text-neutral-200">
                Category
              </Label>
              <select
                id="itemCategory"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleInputChange}
                className="rounded-md bg-zinc-800 border border-zinc-700 text-neutral-200 p-2"
                required
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="documents">Documents</option>
                <option value="fragile">Fragile Items</option>
                <option value="perishable">Perishable Goods</option>
                <option value="other">Other</option>
              </select>
            </LabelInputContainer>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconMapPin className="h-5 w-5" />}
            title="Shipping Route"
            description="Specify pickup and delivery locations"
          />

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <LabelInputContainer>
                <Label htmlFor="originLocation" className="text-neutral-200">
                  <IconMapPin className="inline-block h-4 w-4 mr-1" />
                  Origin Location
                </Label>
                <Input
                  id="originLocation"
                  name="originLocation"
                  placeholder="e.g., 123 Main St, New York, NY"
                  value={formData.originLocation}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label
                  htmlFor="destinationLocation"
                  className="text-neutral-200"
                >
                  <IconMapPin className="inline-block h-4 w-4 mr-1" />
                  Destination Location
                </Label>
                <Input
                  id="destinationLocation"
                  name="destinationLocation"
                  placeholder="e.g., 456 Oak St, Los Angeles, CA"
                  value={formData.destinationLocation}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                  required
                />
              </LabelInputContainer>
            </div>
          </div>
        </section>

        {/* Package Details Section */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconTruck className="h-5 w-5" />}
            title="Package Specifications"
            description="Enter the physical characteristics of your package"
          />

          <div className="mb-8">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="packageWeight" className="text-neutral-200">
                Package Weight (kg)
              </Label>
              <Input
                type="number"
                id="packageWeight"
                name="packageWeight"
                placeholder="e.g., 5"
                min="0.1"
                step="0.1"
                value={formData.packageWeight}
                onChange={handleInputChange}
                className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                required
              />
            </LabelInputContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <LabelInputContainer>
                <Label htmlFor="length" className="text-neutral-200">
                  Length (cm)
                </Label>
                <Input
                  type="number"
                  id="length"
                  name="packageDimensions.length"
                  placeholder="e.g., 30"
                  min="1"
                  value={formData.packageDimensions.length}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="width" className="text-neutral-200">
                  Width (cm)
                </Label>
                <Input
                  type="number"
                  id="width"
                  name="packageDimensions.width"
                  placeholder="e.g., 20"
                  min="1"
                  value={formData.packageDimensions.width}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="height" className="text-neutral-200">
                  Height (cm)
                </Label>
                <Input
                  type="number"
                  id="height"
                  name="packageDimensions.height"
                  placeholder="e.g., 15"
                  min="1"
                  value={formData.packageDimensions.height}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500"
                  required
                />
              </LabelInputContainer>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="fragile"
                name="fragile"
                checked={formData.fragile}
                onChange={(e) =>
                  setFormData({ ...formData, fragile: e.target.checked })
                }
                className="mr-2 h-4 w-4 bg-zinc-800 border-zinc-700 rounded"
              />
              <Label htmlFor="fragile" className="text-neutral-200">
                This package contains fragile items
              </Label>
            </div>
          </div>
        </section>

        {/* Budget and Timeline Section */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconClock className="h-5 w-5" />}
            title="Budget & Timeline"
            description="Set your budget and delivery requirements"
          />

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <LabelInputContainer>
                <Label htmlFor="maxBudget" className="text-neutral-200">
                  Maximum Budget (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    $
                  </span>
                  <Input
                    type="number"
                    id="maxBudget"
                    name="maxBudget"
                    placeholder="e.g., 100"
                    min="1"
                    value={formData.maxBudget}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-neutral-200 placeholder:text-neutral-500 pl-8"
                    required
                  />
                </div>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label
                  htmlFor="requiredDeliveryDate"
                  className="text-neutral-200"
                >
                  <IconCalendar className="inline-block h-4 w-4 mr-1" />
                  Required Delivery By
                </Label>
                <Input
                  type="date"
                  id="requiredDeliveryDate"
                  name="requiredDeliveryDate"
                  value={formData.requiredDeliveryDate}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700 text-neutral-200"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </LabelInputContainer>
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconPhoto className="h-5 w-5" />}
            title="Package Images"
            description="Upload clear photos of your items (optional)"
          />

          <div className="mb-8">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="images" className="text-white">
                Upload Images (optional)
              </Label>
              <div className="w-full border border-dashed bg-black border-zinc-800 rounded-lg">
                <FileUpload
                  onChange={(files) => {
                    setFormData({ ...formData, images: files });

                    // Generate preview URLs
                    const newImageUrls: string[] = [];
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          newImageUrls.push(reader.result);
                          if (newImageUrls.length === files.length) {
                            setImagePreviewUrls(newImageUrls);
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />
              </div>
              <p className="text-xs text-white mt-1">
                Upload clear images of your package (max 5 images)
              </p>
            </LabelInputContainer>
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                      onClick={() => {
                        const newUrls = [...imagePreviewUrls];
                        newUrls.splice(index, 1);
                        setImagePreviewUrls(newUrls);

                        const newFiles = [...formData.images];
                        newFiles.splice(index, 1);
                        setFormData({ ...formData, images: newFiles });
                      }}
                    >
                      <IconX className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Additional Options */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <SectionHeader
            icon={<IconCheckbox className="h-5 w-5" />}
            title="Additional Options"
          />

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-700/30">
              <input
                type="checkbox"
                id="insurance"
                className="w-4 h-4 rounded border-zinc-600"
              />
              <div>
                <Label
                  htmlFor="insurance"
                  className="text-neutral-200 font-medium"
                >
                  Shipping Insurance
                </Label>
                <p className="text-sm text-neutral-400">
                  Protect your package up to $1000 in case of damage or loss
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-700/30">
              <input
                type="checkbox"
                id="saveAsDraft"
                name="saveAsDraft"
                checked={formData.saveAsDraft}
                onChange={(e) =>
                  setFormData({ ...formData, saveAsDraft: e.target.checked })
                }
                className="w-4 h-4 rounded border-zinc-600"
              />
              <div>
                <Label
                  htmlFor="saveAsDraft"
                  className="text-neutral-200 font-medium"
                >
                  Save as Draft
                </Label>
                <p className="text-sm text-neutral-400">
                  Save this request and publish it later
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center" >
          <Button
            type="button"
            className="relative inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-800 px-4 py-4 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
            onClick={() => router.push("/your-bid")}
            disabled={isLoading}
          >
            Cancel
            <BottomGradient />
          </Button>

          <Button
            type="submit"
            className="relative inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700/50 bg-neutral-800 px-4 py-4 text-sm font-medium text-white hover:bg-neutral-700 transition-colors group/btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : formData.saveAsDraft ? (
              <>
                Save Draft
                <BottomGradient />
              </>
            ) : (
              <>
                Create Shipping Request
                <BottomGradient />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
