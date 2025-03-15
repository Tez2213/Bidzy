import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Use this exact format
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Move this outside of try/catch - this is how find-bid page handles it
  const id = params?.id;
  
  if (!id) {
    return NextResponse.json({ message: "Bid ID is required" }, { status: 400 });
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Fetch the bid with related data
    const bid = await prisma.bid.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        }
      },
    });

    if (!bid) {
      return NextResponse.json({ message: "Bid not found" }, { status: 404 });
    }

    // Check if the user is the owner of the bid or it's a public bid
    const isOwner = session?.user?.id === bid.userId;
    const isPublic = bid.status === "published" || bid.status === "active";

    if (!isOwner && !isPublic) {
      return NextResponse.json(
        { message: "You don't have permission to view this bid" },
        { status: 403 }
      );
    }

    return NextResponse.json({ bid });
    
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
