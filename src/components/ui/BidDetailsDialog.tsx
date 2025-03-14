"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  IconMapPin,
  IconCalendarEvent,
  IconTruck,
  IconPackage,
  IconRuler2,
  IconWeight,
  IconInfoCircle,
  IconShield,
  IconAlertTriangle,
  IconCoins,
  IconArrowRight,
  IconLoader2,
  IconUsers,
} from "@tabler/icons-react";

// Bottom gradient effect
const BottomGradient = () => {
  return (
    <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30" />
  );
};

interface Bid {
  id: string;
  userId: string;
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
  insurance: boolean;
  status: string;
  imageUrls: string[];
  responses: number;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
  participantCount?: number;
}

interface BidDetailsDialogProps {
  bid: Bid | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BidDetailsDialog({
  bid,
  isOpen,
  onClose,
}: BidDetailsDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bid) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBidNow = async () => {
    if (!session?.user) {
      toast.error("Please sign in to place a bid");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Here you'd make a request to your API to initiate the bidding process
      // For now, we'll simulate a redirect to a payment page

      // Check if the user has already paid the platform fee for this bid
      const checkResponse = await fetch(`/api/bids/${bid.id}/check-payment`);
      const checkData = await checkResponse.json();

      if (checkResponse.ok && checkData.hasPaid) {
        // If already paid, redirect to bid submission page
        router.push(`/submit-proposal/${bid.id}`);
      } else {
        // If not paid, redirect to payment page
        router.push(`/bid-payment?bidId=${bid.id}`);
      }
    } catch (error) {
      console.error("Error initiating bid:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white p-0 max-w-3xl w-[92vw]">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">{bid.title}</h2>
            <div className="text-xl font-bold text-green-500">
              ${bid.maxBudget.toFixed(2)}
            </div>
          </div>

          <div className="mt-4 flex items-center text-zinc-400">
            <IconMapPin size={16} className="mr-1" />
            <span>
              {bid.originLocation} → {bid.destinationLocation}
            </span>
          </div>

          <div className="mt-1 flex items-center text-zinc-400">
            <IconCalendarEvent size={16} className="mr-1" />
            <span>Delivery by {formatDate(bid.requiredDeliveryDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
            <IconUsers className="h-4 w-4 text-zinc-500" />
            <span>
              {bid.participantCount || 0}{" "}
              {(bid.participantCount || 0) === 1
                ? "participant"
                : "participants"}
            </span>
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Bid details grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Package Weight</div>
              <div className="flex items-center">
                <IconWeight size={18} className="mr-2 text-zinc-400" />
                <span>{bid.packageWeight} kg</span>
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Dimensions</div>
              <div className="flex items-center">
                <IconRuler2 size={18} className="mr-2 text-zinc-400" />
                <span>
                  {bid.packageDimensions.length} × {bid.packageDimensions.width}{" "}
                  × {bid.packageDimensions.height} cm
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">
                Special Requirements
              </div>
              <div className="flex items-center">
                {bid.fragile ? (
                  <>
                    <IconAlertTriangle
                      size={18}
                      className="mr-2 text-amber-400"
                    />
                    <span className="text-amber-400">Fragile Item</span>
                  </>
                ) : (
                  <>
                    <IconInfoCircle size={18} className="mr-2 text-zinc-400" />
                    <span>Standard Handling</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">Insurance</div>
              <div className="flex items-center">
                {bid.insurance ? (
                  <>
                    <IconShield size={18} className="mr-2 text-green-500" />
                    <span className="text-green-500">Required</span>
                  </>
                ) : (
                  <>
                    <IconShield size={18} className="mr-2 text-zinc-400" />
                    <span>Not Required</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 p-3 rounded-lg">
              <div className="text-xs text-zinc-500 mb-1">
                Current Responses
              </div>
              <div className="flex items-center">
                <IconCoins size={18} className="mr-2 text-blue-400" />
                <span>{bid.responses} carriers</span>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-zinc-800" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-zinc-400 whitespace-pre-line text-sm">
              {bid.description}
            </p>
          </div>

          {/* Posted by */}
          <div className="mb-6 flex items-center">
            <div className="mr-3">
              {bid.user?.image ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={bid.user.image}
                    alt={bid.user.name || "User"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 font-medium">
                    {bid.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-zinc-400">Posted by</div>
              <div className="font-medium">
                {bid.user?.name || "Anonymous User"}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="relative">
            <BottomGradient />
            <Button
              onClick={handleBidNow}
              disabled={isProcessing}
              className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6"
            >
              {isProcessing ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Bid on This Job
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
