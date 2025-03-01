import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/bids/[id] - Get a single bid
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bid = await prisma.bid.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Check if the bid belongs to the current user
    if (bid.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Error fetching bid:", error);
    return NextResponse.json({ error: "Failed to fetch bid" }, { status: 500 });
  }
}

// PUT /api/bids/[id] - Update a bid
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();

    // First check if the bid exists and belongs to the user
    const existingBid = await prisma.bid.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingBid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    if (existingBid.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the bid
    const updatedBid = await prisma.bid.update({
      where: {
        id: params.id,
      },
      data: {
        title: json.title,
        description: json.description,
        itemCategory: json.itemCategory,
        originLocation: json.originLocation,
        destinationLocation: json.destinationLocation,
        packageWeight: parseFloat(json.packageWeight),
        packageDimensions: json.packageDimensions,
        fragile: json.fragile,
        maxBudget: parseFloat(json.maxBudget),
        requiredDeliveryDate: new Date(json.requiredDeliveryDate),
        status: json.saveAsDraft ? "draft" : "published",
        images: json.images || existingBid.images,
      },
    });

    return NextResponse.json(updatedBid);
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json(
      { error: "Failed to update bid" },
      { status: 500 }
    );
  }
}

// DELETE /api/bids/[id] - Delete a bid
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if the bid exists and belongs to the user
    const existingBid = await prisma.bid.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingBid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    if (existingBid.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the bid
    await prisma.bid.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return NextResponse.json(
      { error: "Failed to delete bid" },
      { status: 500 }
    );
  }
}
