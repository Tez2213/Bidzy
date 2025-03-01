import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Fixed userId for demo without auth
    const demoUserId = "123456789012345678901234"; // Use a valid ObjectId format for MongoDB

    const bids = await prisma.bid.findMany({
      where: {
        userId: demoUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, itemId } = body;

    if (!amount || !itemId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fixed userId for demo without auth
    const demoUserId = "123456789012345678901234"; // Use a valid ObjectId format

    const bid = await prisma.bid.create({
      data: {
        amount: parseFloat(amount),
        userId: demoUserId,
        itemId,
      },
    });

    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}
