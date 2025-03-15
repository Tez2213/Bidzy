import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "recent";

    // Replace the existing where logic with this enhanced version
    let where = {};
    let isCarrierView = false;

    // For "active" specifically, we need to check if user is the carrier
    if (status === "active") {
      where = { carrierId: session.user.id };
      isCarrierView = true;
    } else {
      // For other statuses, show user's created bids
      where = { userId: session.user.id };
      
      // Add status filter if provided and not "all"
      if (status && status !== "all") {
        where.status = status;
      }
    }

    // Search by title, pickup, or destination
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { pickup: { contains: search, mode: "insensitive" } },
        { destination: { contains: search, mode: "insensitive" } }
      ];
    }

    // Determine sort order
    let orderBy = {};
    switch (sort) {
      case "budget_high":
        orderBy = { budget: "desc" };
        break;
      case "budget_low":
        orderBy = { budget: "asc" };
        break;
      case "deadline":
        orderBy = { deadline: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch bids
    const bids = await prisma.bid.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    // Get counts for each status
    const counts = {
      all: await prisma.bid.count({ 
        where: { userId: session.user.id } 
      }),
      draft: await prisma.bid.count({ 
        where: { userId: session.user.id, status: "draft" } 
      }),
      published: await prisma.bid.count({ 
        where: { userId: session.user.id, status: "published" } 
      }),
      active: await prisma.bid.count({ 
        where: { carrierId: session.user.id, status: "active" } 
      }),
      completed: await prisma.bid.count({ 
        where: { userId: session.user.id, status: "completed" } 
      }),
    };

    return NextResponse.json({ 
      success: true, 
      bids,
      counts
    });
    
  } catch (error) {
    console.error("Error fetching user bids:", error);
    // Fix the syntax error here
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch bids" },
      { status: 500 }
    );
  }
}