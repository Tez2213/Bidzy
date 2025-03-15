import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request, context) {
  try {
    // Get bid ID from URL params
    const id = context.params?.id;
    console.log("Processing bid publish request for ID:", id);

    if (!id) {
      console.error("No bid ID provided");
      return NextResponse.json({ success: false, message: "Bid ID is required" }, { status: 400 });
    }

    // Get transaction hash from request body
    const { transactionHash } = await request.json();
    console.log("Transaction hash received:", transactionHash);

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Check if the bid exists and belongs to the user
    const bid = await prisma.bid.findUnique({
      where: { id },
    });

    if (!bid) {
      console.error("Bid not found:", id);
      return NextResponse.json({ success: false, message: "Bid not found" }, { status: 404 });
    }

    if (bid.userId !== session.user.id) {
      console.error("User doesn't own this bid");
      return NextResponse.json(
        { success: false, message: "You don't have permission to publish this bid" },
        { status: 403 }
      );
    }

    // Create a payment record first
    try {
      const payment = await prisma.payment.create({
        data: {
          amount: 0.000005, // Match your PLATFORM_FEE
          currency: "ETH",
          transactionHash,
          type: "publication_fee",
          status: "completed",
          userId: session.user.id,
        },
      });
      console.log("Payment record created:", payment.id);

      // Then update the bid status
      const updatedBid = await prisma.bid.update({
        where: { id },
        data: {
          status: "published",
          paymentId: payment.id,
        },
      });
      console.log("Bid updated to published status");

      return NextResponse.json({
        success: true,
        message: "Bid published successfully",
        bid: updatedBid,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, message: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error publishing bid:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}