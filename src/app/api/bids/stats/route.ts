import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        bids: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stats = {
      totalBids: user.bids.length,
      activeBids: user.bids.filter(bid => bid.status === "ACTIVE").length,
      wonBids: user.bids.filter(bid => bid.status === "WON").length,
      lastActive: user.bids.length > 0 
        ? user.bids.reduce((latest, bid) => 
            bid.createdAt > latest ? bid.createdAt : latest, 
            user.bids[0].createdAt
          ).toISOString()
        : null
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bid statistics" },
      { status: 500 }
    );
  }
}