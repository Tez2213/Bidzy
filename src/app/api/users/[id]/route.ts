import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Only allow users to access their own data
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        // You can add other fields as needed
        // Don't include sensitive info like password hash
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // You could add additional data like bid counts with a query like:
    const activeBids = await prisma.bid.count({
      where: {
        userId: params.id,
        status: "ACTIVE",
      },
    });

    const successfulBids = await prisma.bid.count({
      where: {
        userId: params.id,
        status: "SUCCESSFUL",
      },
    });

    // Return user data with additional stats
    return NextResponse.json({
      ...user,
      activeBids,
      successfulBids,
      totalProjects: activeBids + successfulBids,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}