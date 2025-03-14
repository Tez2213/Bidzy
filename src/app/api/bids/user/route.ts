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

    // Get bids created by the user
    const createdBids = await prisma.bid.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        payments: {
          where: {
            status: "completed",
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get bids the user is participating in
    const participatingPayments = await prisma.bidPayment.findMany({
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
    });

    // Filter out any bids that the user created (to avoid duplicates)
    const participatingBids = participatingPayments
      .filter((payment) => payment.bid.userId !== session.user.id)
      .map((payment) => payment.bid);

    // Format created bids with participant count
    const formattedCreatedBids = createdBids.map((bid) => ({
      ...bid,
      participantCount: bid.payments.length,
      payments: undefined,
      type: "created",
    }));

    // Format participating bids with participant count
    const formattedParticipatingBids = participatingBids.map((bid) => ({
      ...bid,
      participantCount: bid.payments.length,
      payments: undefined,
      type: "participating",
    }));

    return NextResponse.json({
      createdBids: formattedCreatedBids,
      participatingBids: formattedParticipatingBids,
    });
  } catch (error) {
    console.error("Error fetching user bids:", error);
    return NextResponse.json(
      { message: "Failed to fetch bids", error: String(error) },
      { status: 500 }
    );
  }
}
