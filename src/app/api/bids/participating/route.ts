import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to view your bids" },
        { status: 401 }
      );
    }

    // Get bids the user is participating in (has paid for)
    const participatingBids = await prisma.bidPayment.findMany({
      where: {
        userId: session.user.id,
        status: "completed",
      },
      include: {
        bid: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            // Count the number of participants
            payments: {
              where: {
                status: "completed",
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response data
    const formattedBids = participatingBids.map((payment) => ({
      ...payment.bid,
      participantCount: payment.bid.payments.length,
      payments: undefined, // Remove raw payment data
    }));

    return NextResponse.json({ bids: formattedBids });
  } catch (error) {
    console.error("Error fetching participating bids:", error);
    return NextResponse.json(
      { message: "Failed to fetch participating bids", error: String(error) },
      { status: 500 }
    );
  }
}
