import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// This is a fallback API that returns empty data
export async function GET() {
  return NextResponse.json([]);
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
