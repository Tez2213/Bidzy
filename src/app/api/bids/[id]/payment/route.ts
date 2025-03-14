import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bidId = params.id;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Get the bid
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) {
      return NextResponse.json(
        { message: "Bid not found" },
        { status: 404 }
      );
    }

    // Check if user owns this bid
    if (bid.userId !== user.id) {
      return NextResponse.json(
        { message: "You don't have permission to update this bid" },
        { status: 403 }
      );
    }

    // Check if bid is in pending_payment status
    if (bid.status !== "pending_payment" && bid.status !== "draft") {
      return NextResponse.json(
        { message: `This bid is not eligible for payment (status: ${bid.status})` },
        { status: 400 }
      );
    }

    // Update bid status to published
    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: {
        status: "published",
      },
    });

    // Return updated bid info
    return NextResponse.json({
      message: "Payment processed successfully",
      bid: updatedBid,
    });
    
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "Failed to process payment", error: String(error) },
      { status: 500 }
    );
  }
}
