"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconLoader2, IconMapPin, IconCalendar, IconPackage, IconTruck, IconShip, IconPlane, IconWallet } from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/utils";

// Constants for payment
const ADMIN_WALLET = "0x4494101f2B4806a8969cb5C0Ff9787cB13aC5ab4"; 
const ETH_TO_USD = 0.00037; // This should be fetched from an API in production
const PLATFORM_FEE = 10; // Platform fee in USD

export function BidDetailModal({ bid, isOpen, onClose }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showSuccess, setShowSuccess] = useState(false);

  // Get category icon
  const getCategoryIcon = () => {
    switch (bid?.category) {
      case "ground":
        return <IconTruck className="h-5 w-5" />;
      case "sea":
        return <IconShip className="h-5 w-5" />;
      case "air":
        return <IconPlane className="h-5 w-5" />;
      default:
        return <IconPackage className="h-5 w-5" />;
    }
  };

  const handleCryptoPayment = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to make payments");
      return;
    }

    if (!bid?.id) {
      toast.error("Bid information is missing");
      return;
    }

    setIsLoading(true);
    setError(null);
    let txHash;

    try {
      // Convert USD platform fee to ETH
      const ethAmount = (PLATFORM_FEE * ETH_TO_USD).toFixed(8);
      const weiAmount = ethers.parseEther(ethAmount);

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Create transaction parameters
      const transactionParameters = {
        to: ADMIN_WALLET,
        from: accounts[0],
        value: ethers.toQuantity(weiAmount),
        gas: ethers.toQuantity(21000),
      };

      console.log("Starting transaction with params:", JSON.stringify(transactionParameters));
      
      // Send transaction
      txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log("Transaction submitted with hash:", txHash);
      toast.loading("Waiting for transaction confirmation...");

      // Add a delay to ensure transaction is processed on blockchain
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        console.log("Updating bid status for bid:", bid.id);
        // Update bid payment status
        const response = await fetch(`/api/bids/${bid.id}/accept`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionHash: txHash,
            amount: PLATFORM_FEE,
            currency: 'ETH'
          })
        });

        console.log("API response status:", response.status);
        
        const responseData = await response.json();
        console.log("API response:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Failed to update bid status");
        }

        setShowSuccess(true);
        toast.success("Payment successful! Bid accepted.");

        // Redirect after success
        setTimeout(() => {
          onClose();
          router.push("/your-bid");
        }, 2000);
      } catch (apiError) {
        console.error("API error:", apiError);
        
        // Store transaction hash for later verification
        localStorage.setItem('pendingTx_' + bid.id, JSON.stringify({
          txHash,
          bidId: bid.id,
          amount: PLATFORM_FEE,
          timestamp: new Date().toISOString()
        }));
        
        setError(`Payment processed on blockchain (tx: ${txHash.substring(0, 10)}...) but our servers couldn't record it. Your transaction is saved and our team will verify it.`);
        toast.error("Status update failed. Transaction is saved for verification.");
      }

    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-center text-zinc-100">
              Payment Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <IconWallet className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-center text-zinc-300">
              Your bid has been accepted and payment processed successfully. 
              You will be redirected to your bids page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-100 flex items-center gap-2">
            <span>{bid?.title}</span>
            <Badge className="ml-2 capitalize bg-blue-500/20 text-blue-300 border-blue-500/50">
              {bid?.category}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Posted {formatDate(bid?.createdAt)} • Budget: {formatCurrency(bid?.budget)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50">
            <TabsTrigger value="details">Shipping Details</TabsTrigger>
            <TabsTrigger value="payment">Accept & Pay</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-1">
            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <IconMapPin className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Pickup Location</p>
                    <p className="text-zinc-200">{bid?.pickup || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <IconMapPin className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Destination</p>
                    <p className="text-zinc-200">{bid?.destination || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div>
                <h4 className="text-zinc-300 font-medium mb-2">Shipment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Weight</p>
                    <p className="text-zinc-200">{bid?.weight || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Dimensions</p>
                    <p className="text-zinc-200">{bid?.dimensions || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Item Type</p>
                    <p className="text-zinc-200">{bid?.itemType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Required By</p>
                    <p className="text-zinc-200">{formatDate(bid?.deadline) || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div>
                <h4 className="text-zinc-300 font-medium mb-2">Description</h4>
                <p className="text-zinc-200 text-sm whitespace-pre-wrap">{bid?.description || "No description provided."}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="p-1">
            <div className="space-y-6 mt-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-lg font-medium text-zinc-100 mb-3">Bid Acceptance</h3>
                <p className="text-zinc-300 mb-4">
                  To accept this shipping job, you'll need to pay a platform fee of {formatCurrency(PLATFORM_FEE)}. 
                  This fee helps ensure quality service and secure transactions.
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                    <span className="text-zinc-300">Platform Fee</span>
                    <span className="text-zinc-100 font-medium">{formatCurrency(PLATFORM_FEE)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-zinc-300">Equivalent in ETH</span>
                    <span className="text-zinc-100 font-medium">{(PLATFORM_FEE * ETH_TO_USD).toFixed(6)} ETH</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800/50 rounded text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleCryptoPayment} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>Pay with MetaMask ({(PLATFORM_FEE * ETH_TO_USD).toFixed(6)} ETH)</>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("details")} 
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Back to Details
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}