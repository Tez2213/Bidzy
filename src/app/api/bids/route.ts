import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/bids - Fetch all bids for the current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bids = await prisma.bid.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}

// POST /api/bids - Create a new bid
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();

    // Create bid with the authenticated user's ID
    const bid = await prisma.bid.create({
      data: {
        title: json.title,
        description: json.description,
        itemCategory: json.itemCategory,
        originLocation: json.originLocation,
        destinationLocation: json.destinationLocation,
        packageWeight: parseFloat(json.packageWeight),
        packageDimensions: json.packageDimensions,
        fragile: Boolean(json.fragile),
        maxBudget: parseFloat(json.maxBudget),
        requiredDeliveryDate: new Date(json.requiredDeliveryDate),
        status: json.saveAsDraft ? "draft" : "published",
        userId: session.user.id,
        images: json.images || [],
      },
    });

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}
