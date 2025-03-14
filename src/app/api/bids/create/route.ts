import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be logged in to create a bid" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse the request body
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
      insurance,
      status,
      imageUrls,
    } = body;

    // Create the bid in the database
    const bid = await prisma.bid.create({
      data: {
        userId: user.id,
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
        insurance,
        status: status === "draft" ? "draft" : "pending_payment",
        imageUrls: imageUrls || [],
        responses: 0,
      },
    });

    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { message: "Failed to create bid", error: String(error) },
      { status: 500 }
    );
  }
}
