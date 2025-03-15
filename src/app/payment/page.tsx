"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { ethers } from "ethers";

// Loading fallback component
function PaymentLoading() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <IconLoader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-zinc-300 text-lg">Loading payment page...</p>
      </div>
    </div>
  );
}

// Constants for demonstration purposes
const PLATFORM_FEE = 0.000005; // ETH 
const ADMIN_WALLET = "0x4494101f2B4806a8969cb5C0Ff9787cB13aC5ab4";

// Main payment content component that uses useSearchParams
function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bidId = searchParams.get("bidId");
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bid, setBid] = useState(null);
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!bidId) {
      setError("No bid ID provided");
      setLoading(false);
      return;
    }
    
    fetchBidDetails();
  }, [bidId]);

  async function fetchBidDetails() {
    setLoading(true);
    try {
      const response = await fetch(`/api/bids/${bidId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bid details");
      }
      
      const data = await response.json();
      setBid(data.bid);
    } catch (error) {
      console.error("Error fetching bid:", error);
      setError("Failed to load bid details");
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    if (!window.ethereum) {
      setError("Please install MetaMask to make payments");
      return;
    }

    setError(null);
    setProcessing(true);
    let txHash = null;

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const weiAmount = ethers.parseEther(PLATFORM_FEE.toString());
      
      // Create transaction parameters
      const transactionParameters = {
        to: ADMIN_WALLET,
        from: accounts[0],
        value: weiAmount.toString(),
      };
      
      // Send transaction
      txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      setTransactionHash(txHash);
      console.log("Transaction successful, hash:", txHash);
      
      // Now update the bid status
      try {
        // Update bid status to reflect payment
        const response = await fetch(`/api/bids/${bidId}/publish`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionHash: txHash,
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to update bid status");
        }

        console.log("Bid published successfully:", data);
        setSuccess(true);
        
        // Redirect after successful payment
        setTimeout(() => {
          router.push('/your-bid');
        }, 3000);
      } catch (apiError) {
        console.error("API error:", apiError);
        
        // Payment was successful but API update failed
        setError("Your payment was successful, but there was an issue updating the bid. Please contact support with this transaction ID: " + txHash);
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      
      if (txHash) {
        // Transaction was successful but something else failed
        setError(`Payment completed (ID: ${txHash.substring(0, 10)}...), but there was an error. Please contact support.`);
      } else {
        // Transaction failed
        setError(error.message || "Payment failed");
      }
    } finally {
      setProcessing(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/your-bid" className="text-blue-400 hover:text-blue-300 flex items-center">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Bids
            </Link>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <IconAlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-red-300 mb-2">Error</h2>
            <p className="text-zinc-300 mb-6">{error}</p>
            <Button 
              onClick={() => router.push('/your-bid')}
              className="bg-zinc-800 hover:bg-zinc-700"
            >
              Back to Bids
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <IconLoader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-zinc-300 text-lg">Loading bid details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-green-300 mb-2">Payment Successful!</h2>
            <p className="text-zinc-300 mb-2">Your payment has been processed and your bid is now published.</p>
            <p className="text-zinc-400 text-sm mb-6">Transaction ID: {transactionHash?.substring(0, 10)}...</p>
            <p className="text-zinc-400 mb-8">Redirecting you to your bids...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/your-bid" className="text-blue-400 hover:text-blue-300 flex items-center">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Bids
          </Link>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-2xl font-semibold text-white mb-2">Complete Payment</h2>
            <p className="text-zinc-400">Pay the platform fee to publish your shipping request</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-zinc-200 mb-4">Bid Details</h3>
              
              {bid && (
                <div className="space-y-4 bg-zinc-800/30 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Title</span>
                    <span className="text-zinc-200 font-medium">{bid.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Origin</span>
                    <span className="text-zinc-200">{bid.pickup || bid.originLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Destination</span>
                    <span className="text-zinc-200">{bid.destination || bid.destinationLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Budget</span>
                    <span className="text-zinc-200 font-medium">${bid.budget || bid.maxBudget}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-zinc-200 mb-4">Payment Details</h3>
              <div className="space-y-4 bg-zinc-800/30 p-4 rounded-md">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Platform Fee</span>
                  <span className="text-zinc-200 font-medium">{PLATFORM_FEE} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payment Method</span>
                  <span className="text-zinc-200">MetaMask (ETH)</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-600/30 rounded p-4 mb-8">
              <p className="text-blue-300 text-sm">
                This payment will publish your shipping request, making it visible to carriers on the platform.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {processing ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
}
