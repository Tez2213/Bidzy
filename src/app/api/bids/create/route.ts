import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth"; // Changed from authOptions to authConfig
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get user session with the correct auth config
    const session = await getServerSession(authConfig);
    console.log("API Session:", session); // For debugging

    if (!session) {
      console.error("No session found in API route");
      return NextResponse.json(
        { message: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    if (!session.user || !session.user.id) {
      console.error("Invalid session structure:", session);
      return NextResponse.json(
        { message: "Invalid session. Please sign in again." },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();

    const {
      title,
      description,
      itemCategory,
      originLocation,
      destinationLocation,
      packageWeight,
      packageDimensions,
      fragile,
      maxBudget,
      requiredDeliveryDate,
      liveBiddingStart, // Our new field
      insurance,
      status,
      imageUrls,
    } = body;

    // Create the bid in the database
    const bid = await prisma.bid.create({
      data: {
        userId: session.user.id,
        title,
        description,
        itemCategory,
        originLocation,
        destinationLocation,
        packageWeight,
        packageDimensions,
        fragile,
        maxBudget,
        requiredDeliveryDate: new Date(requiredDeliveryDate),
        liveBiddingStart: liveBiddingStart ? new Date(liveBiddingStart) : null, // Handle the new field
        insurance,
        status: status === "draft" ? "draft" : "pending_payment",
        imageUrls: imageUrls || [],
        responses: 0,
      },
    });

    return NextResponse.json(
      {
        message: "Bid created successfully",
        bid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create bid" },
      { status: 500 }
    );
  }
}
