import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bidId = params.id;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the bid with participant count
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        payments: {
          where: {
            status: "completed",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!bid) {
      return NextResponse.json({ message: "Bid not found" }, { status: 404 });
    }

    // Anyone can view published bids, but only owners can view their own drafts
    const isOwner = bid.userId === session.user.id;
    if (!isOwner && bid.status !== "published") {
      return NextResponse.json(
        { message: "You don't have permission to view this bid" },
        { status: 403 }
      );
    }

    // Check if the current user is participating
    const isParticipating = await prisma.bidPayment.findFirst({
      where: {
        bidId: bidId,
        userId: session.user.id,
        status: "completed",
      },
    });

    // Format the response
    const bidWithCounts = {
      ...bid,
      participantCount: bid.payments.length,
      isParticipating: !!isParticipating,
      payments: undefined, // Remove payment details from response
    };

    // Return the bid
    return NextResponse.json({ bid: bidWithCounts });
  } catch (error) {
    console.error("Error fetching bid:", error);
    return NextResponse.json(
      { message: "Failed to fetch bid", error: String(error) },
      { status: 500 }
    );
  }
}

// Similar fix for DELETE handler
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bidId = params.id;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get the bid
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) {
      return NextResponse.json({ message: "Bid not found" }, { status: 404 });
    }

    // Check if user owns this bid
    if (bid.userId !== user.id) {
      return NextResponse.json(
        { message: "You don't have permission to delete this bid" },
        { status: 403 }
      );
    }

    // Delete the bid
    await prisma.bid.delete({
      where: { id: bidId },
    });

    return NextResponse.json({
      message: "Bid deleted successfully",
    });
  } catch (error) {
    // Fix the error formatting
    console.error("Error deleting bid:", error);
    return NextResponse.json(
      { message: "Failed to delete bid", error: String(error) },
      { status: 500 }
    );
  }
}
