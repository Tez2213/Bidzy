import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { transactionHash, amount, currency } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Bid ID is required" },
        { status: 400 }
      );
    }

    console.log("Processing bid acceptance:", id, "by user:", session.user.id);

    // Find the bid to ensure it exists and is available
    const bid = await prisma.bid.findUnique({
      where: { id },
    });

    if (!bid) {
      console.error("Bid not found:", id);
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    console.log("Found bid:", bid.id, "with status:", bid.status);

    if (bid.status !== "published") {
      return NextResponse.json(
        { 
          success: false, 
          message: "This bid is not available for acceptance" 
        },
        { status: 400 }
      );
    }

    try {
      // First, create the payment record
      const payment = await prisma.payment.create({
        data: {
          amount: parseFloat(amount),
          currency: currency || "ETH",
          transactionHash: transactionHash,
          type: "bid_acceptance",
          status: "completed",
          userId: session.user.id
        }
      });
      
      console.log("Created payment record:", payment.id);

      // Check if the status is correctly being set to "active"
      const updatedBid = await prisma.bid.update({
        where: { id },
        data: {
          status: "active", // This should be exactly "active"
          carrierId: session.user.id,
          paymentId: payment.id
        }
      });
      
      console.log("Updated bid status to active");

      return NextResponse.json({ 
        success: true, 
        message: "Bid accepted successfully",
        bid: updatedBid
      });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      
      return NextResponse.json(
        { success: false, message: "Database error: " + dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error accepting bid:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}