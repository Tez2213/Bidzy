"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface PaymentProps {
  type?: "bid-creation" | "bid-participation";
  amount?: number;
}

export default function PaymentPage({ type = "bid-creation", amount = 50 }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-zinc-800/50 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {type === "bid-creation" ? "Bid Creation Fee" : "Bid Participation Fee"}
            </h1>
            <p className="text-gray-400">
              {type === "bid-creation" 
                ? "Pay the required fee to publish your bid"
                : "Pay the participation fee to join this auction"}
            </p>
          </div>

          {/* Amount Display */}
          <div className="bg-zinc-900/50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Fee Amount:</span>
              <span className="text-2xl font-bold text-white">${amount}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 rounded-lg border ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                } transition-colors`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/credit-card.svg"
                      alt="Credit Card"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white">Credit Card</span>
                </div>
              </button>

              <button
                className={`p-4 rounded-lg border ${
                  paymentMethod === "paypal"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                } transition-colors`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 relative">
                    <Image
                      src="/paypal.svg"
                      alt="PayPal"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white">PayPal</span>
                </div>
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="bg-zinc-900/50 border-zinc-700 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      className="bg-zinc-900/50 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="bg-zinc-900/50 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Form */}
            {paymentMethod === "paypal" && (
              <div className="mt-6 text-center text-gray-400">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 py-6"
              onClick={() => console.log("Processing payment...")}
            >
              Pay ${amount}
            </Button>

            {/* Terms */}
            <p className="text-sm text-gray-400 text-center mt-4">
              By proceeding, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}