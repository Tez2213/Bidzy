"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  IconMapPin,
  IconPackage,
  IconTruck,
  IconCalendar,
  IconPhoto,
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Prisma } from "@prisma/client";

// Section Header Component
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
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-zinc-400 ml-10">{description}</p>
      )}
    </div>
  );
};

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
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    insurance: false,
    saveAsDraft: false,
    images: [] as File[],
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // File input reference for custom button
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error("Please sign in to create a bid");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload images first
      const imageUrls: string[] = [];
      
      if (formData.images.length > 0) {
        setUploadProgress(10);
        
        // For each image, upload to your storage
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          
          // Create form data for upload
          const uploadData = new FormData();
          uploadData.append('file', file);
          
          // Upload the image
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
          }
          
          const uploadResult = await uploadResponse.json();
          imageUrls.push(uploadResult.url);
          
          // Update progress
          setUploadProgress(Math.round(((i + 1) / formData.images.length) * 50));
        }
      }
      
      // Create the bid with uploaded image URLs
      const response = await fetch('/api/bids/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          itemCategory: formData.itemCategory,
          originLocation: formData.originLocation,
          destinationLocation: formData.destinationLocation,
          packageWeight: parseFloat(formData.packageWeight),
          packageDimensions: {
            length: parseFloat(formData.packageDimensions.length),
            width: parseFloat(formData.packageDimensions.width),
            height: parseFloat(formData.packageDimensions.height),
          },
          fragile: formData.fragile,
          maxBudget: parseFloat(formData.maxBudget),
          requiredDeliveryDate: formData.requiredDeliveryDate,
          insurance: formData.insurance,
          imageUrls: imageUrls,
          status: formData.saveAsDraft ? 'draft' : 'pending_payment',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bid');
      }
      
      const data = await response.json();
      
      // Handle redirect based on draft status
      if (formData.saveAsDraft) {
        setShowSuccess(true);
        toast.success("Draft saved successfully!");
        
        setTimeout(() => {
          router.push('/your-bid');
        }, 1500);
      } else {
        router.push(`/payment?bidId=${data.bid.id}`);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your bid");
      toast.error(err.message || "Failed to create bid");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Limit to 5 images
      const selectedFiles = Array.from(e.target.files).slice(0, 5);
      setFormData({ ...formData, images: selectedFiles });

      // Generate preview URLs
      const urls: string[] = [];
      selectedFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        urls.push(url);
      });
      setImagePreviewUrls(urls);
    }
  };

  // Add file input validation
  const validateFile = (file: File) => {
    // Check file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return false;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(validateFile);

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);

    const newUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newUrls[index]); // Clean up URL object
    newUrls.splice(index, 1);

    setFormData({ ...formData, images: newImages });
    setImagePreviewUrls(newUrls);
  };

  // Handle other form field changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // Handle nested properties (packageDimensions)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value,
        },
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Success state UI
  if (showSuccess) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <IconCheck className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {formData.saveAsDraft
              ? "Draft Saved!"
              : "Shipping Request Created!"}
          </h2>
          <p className="text-zinc-300">
            {formData.saveAsDraft
              ? "Your shipping request has been saved as a draft."
              : "Your shipping request has been successfully published."}
          </p>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/your-bid")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white w-full sm:w-auto"
            >
              View Your Bids
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Create Shipping Request
        </h1>
        <p className="text-zinc-400 mt-2">
          Fill in the details to get carriers bidding on your shipment
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-xl space-y-8 relative overflow-hidden">
        <BottomGradient />

        {/* Basic Information */}
        <div>
          <SectionHeader
            icon={<IconPackage className="h-5 w-5" />}
            title="Basic Information"
            description="Provide details about your shipment"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="title" className="text-zinc-300">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Electronics Shipment - LA to NYC"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="itemCategory" className="text-zinc-300">
                Item Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="itemCategory"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleInputChange}
                required
                className="h-10 rounded-md px-3 py-2 text-white bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              >
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="food">Food & Perishables</option>
                <option value="other">Other</option>
              </select>
            </LabelInputContainer>
          </div>

          <div className="mt-4">
            <LabelInputContainer>
              <Label htmlFor="description" className="text-zinc-300">
                Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about the items to be shipped..."
                rows={4}
                required
                className="rounded-md px-3 py-2 text-white bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 w-full"
              />
            </LabelInputContainer>
          </div>
        </div>

        {/* Locations */}
        <div>
          <SectionHeader
            icon={<IconMapPin className="h-5 w-5" />}
            title="Locations"
            description="Origin and destination of your shipment"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="originLocation" className="text-zinc-300">
                Origin Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="originLocation"
                name="originLocation"
                value={formData.originLocation}
                onChange={handleInputChange}
                placeholder="e.g., Los Angeles, CA"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="destinationLocation" className="text-zinc-300">
                Destination Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destinationLocation"
                name="destinationLocation"
                value={formData.destinationLocation}
                onChange={handleInputChange}
                placeholder="e.g., New York, NY"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </LabelInputContainer>
          </div>
        </div>

        {/* Package Details */}
        <div>
          <SectionHeader
            icon={<IconTruck className="h-5 w-5" />}
            title="Package Details"
            description="Physical characteristics of your shipment"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="packageWeight" className="text-zinc-300">
                Package Weight (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="packageWeight"
                name="packageWeight"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.packageWeight}
                onChange={handleInputChange}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label className="text-zinc-300">Fragile Items</Label>
              <div className="flex items-center space-x-2 h-10">
                <input
                  id="fragile"
                  name="fragile"
                  type="checkbox"
                  checked={formData.fragile}
                  onChange={handleInputChange}
                  className="rounded text-zinc-600 h-5 w-5 focus:ring-zinc-700 border-zinc-700 bg-zinc-800"
                />
                <Label
                  htmlFor="fragile"
                  className="text-zinc-300 cursor-pointer"
                >
                  Contains fragile items
                </Label>
              </div>
            </LabelInputContainer>
          </div>

          <div className="mt-4">
            <Label className="text-zinc-300 block mb-2">
              Package Dimensions (cm) <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <LabelInputContainer>
                <Label
                  htmlFor="packageDimensions.length"
                  className="text-zinc-400 text-sm"
                >
                  Length
                </Label>
                <Input
                  id="packageDimensions.length"
                  name="packageDimensions.length"
                  type="number"
                  min="1"
                  value={formData.packageDimensions.length}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label
                  htmlFor="packageDimensions.width"
                  className="text-zinc-400 text-sm"
                >
                  Width
                </Label>
                <Input
                  id="packageDimensions.width"
                  name="packageDimensions.width"
                  type="number"
                  min="1"
                  value={formData.packageDimensions.width}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label
                  htmlFor="packageDimensions.height"
                  className="text-zinc-400 text-sm"
                >
                  Height
                </Label>
                <Input
                  id="packageDimensions.height"
                  name="packageDimensions.height"
                  type="number"
                  min="1"
                  value={formData.packageDimensions.height}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </LabelInputContainer>
            </div>
          </div>
        </div>

        {/* Shipping Preferences */}
        <div>
          <SectionHeader
            icon={<IconCalendar className="h-5 w-5" />}
            title="Shipping Preferences"
            description="Budget and timeline for your shipment"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer>
              <Label htmlFor="maxBudget" className="text-zinc-300">
                Maximum Budget ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxBudget"
                name="maxBudget"
                type="number"
                min="1"
                value={formData.maxBudget}
                onChange={handleInputChange}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="requiredDeliveryDate" className="text-zinc-300">
                Required Delivery Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="requiredDeliveryDate"
                name="requiredDeliveryDate"
                type="date"
                value={formData.requiredDeliveryDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </LabelInputContainer>
          </div>

          <div className="mt-4">
            <LabelInputContainer>
              <div className="flex items-center space-x-2">
                <input
                  id="insurance"
                  name="insurance"
                  type="checkbox"
                  checked={formData.insurance}
                  onChange={handleInputChange}
                  className="rounded text-zinc-600 h-5 w-5 focus:ring-zinc-700 border-zinc-700 bg-zinc-800"
                />
                <Label
                  htmlFor="insurance"
                  className="text-zinc-300 cursor-pointer"
                >
                  Request insurance for this shipment
                </Label>
              </div>
            </LabelInputContainer>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <SectionHeader
            icon={<IconPhoto className="h-5 w-5" />}
            title="Package Images"
            description="Upload images of the items to be shipped (optional, max 5)"
          />

          <div className="mt-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <IconPhoto className="w-8 h-8 mb-3 text-zinc-400" />
                  <p className="mb-2 text-sm text-zinc-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG or WEBP (MAX. 5 MB each)
                  </p>
                </div>
                <input
                  id="imageUpload"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-md overflow-hidden h-24 bg-zinc-800"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="hover:opacity-90 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
                    >
                      <IconAlertCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add this inside your form, where you want the image upload section to appear */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2 flex items-center">
            <IconPhoto className="mr-2" />
            Package Photos (Optional)
          </label>

          <div className="mt-1 flex flex-col space-y-2">
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              multiple
            />

            {/* Custom upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
            >
              <IconPhoto className="mr-2" size={18} />
              Add Photos
            </button>

            {/* Selected images preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
            <p className="text-red-500 flex items-center gap-2">
              <IconAlertCircle className="h-5 w-5" />
              {error}
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {isLoading && uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2.5">
              <div
                className="bg-zinc-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <LabelInputContainer className="sm:w-auto">
            <div className="flex items-center h-10">
              <input
                id="saveAsDraft"
                name="saveAsDraft"
                type="checkbox"
                checked={formData.saveAsDraft}
                onChange={handleInputChange}
                className="rounded text-zinc-600 h-5 w-5 focus:ring-zinc-700 border-zinc-700 bg-zinc-800"
              />
              <Label
                htmlFor="saveAsDraft"
                className="ml-2 text-zinc-300 cursor-pointer"
              >
                Save as draft
              </Label>
            </div>
          </LabelInputContainer>

          <div className="flex-1 flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin"></div>
                  {formData.saveAsDraft ? "Saving..." : "Creating..."}
                </div>
              ) : (
                <>{formData.saveAsDraft ? "Save Draft" : "Create Request"}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
