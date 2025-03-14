import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get all published bids
    const bids = await prisma.bid.findMany({
      where: {
        status: "published"
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return NextResponse.json({ bids });
  } catch (error) {
    console.error("Error fetching published bids:", error);
    return NextResponse.json(
      { message: "Failed to fetch bids", error: String(error) },
      { status: 500 }
    );
  }
}