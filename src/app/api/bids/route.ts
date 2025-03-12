import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bids = await prisma.bid.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Item: {
          select: {
            name: true,
            description: true,
            startingPrice: true,
            imageUrl: true,
          }
        }
      }
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
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, itemId, auctionId } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Bid amount is required" },
        { status: 400 }
      );
    }

    if (!itemId && !auctionId) {
      return NextResponse.json(
        { error: "Either itemId or auctionId is required" },
        { status: 400 }
      );
    }

    const bidAmount = parseFloat(amount);
    
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid bid amount" },
        { status: 400 }
      );
    }

    // If itemId is provided, check if the item exists and get current highest bid
    if (itemId) {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
          bids: {
            orderBy: { amount: 'desc' },
            take: 1
          }
        }
      });

      if (!item) {
        return NextResponse.json(
          { error: "Item not found" },
          { status: 404 }
        );
      }

      // For reverse auction, check if bid is lower than current lowest bid
      if (item.bids.length > 0 && bidAmount >= item.bids[0].amount) {
        return NextResponse.json(
          { error: "Bid must be lower than current lowest bid" },
          { status: 400 }
        );
      }
    }

    // Create the bid in database
    const bid = await prisma.bid.create({
      data: {
        amount: bidAmount,
        userId: session.user.id,
        ...(itemId ? { itemId } : {}),
        ...(auctionId ? { auctionId } : {})
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        Item: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      }
    });

    // If you want to notify your socket server about the new bid
    try {
      // Format the bid data for socket emission
      const socketBidData = {
        id: bid.id,
        amount: bid.amount,
        userId: bid.userId,
        username: bid.user.name || "Anonymous",
        userImage: bid.user.image,
        timestamp: bid.createdAt,
        itemId: bid.itemId,
        itemName: bid.Item?.name || "Unknown Item",
        auctionId: auctionId || itemId // Use either the auction ID or item ID as the auction identifier
      };

      // You could emit to your socket server here
      // or have a webhook that notifies your Railway socket server
      // For now, we'll just log it
      console.log("New bid created:", socketBidData);

      // In a production app, you might want to send this to your socket server
      // await fetch(process.env.SOCKET_WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'new_bid', data: socketBidData })
      // });
    } catch (socketError) {
      console.error("Failed to notify socket server:", socketError);
      // Don't fail the API call if socket notification fails
    }

    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}

// Optional: Add a DELETE method to allow users to retract bids (if your business logic allows)
export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const bidId = url.searchParams.get('id');

    if (!bidId) {
      return NextResponse.json(
        { error: "Bid ID is required" },
        { status: 400 }
      );
    }

    // Check if the bid exists and belongs to the user
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: 404 }
      );
    }

    if (bid.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own bids" },
        { status: 403 }
      );
    }

    // Delete the bid
    await prisma.bid.delete({
      where: { id: bidId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return NextResponse.json(
      { error: "Failed to delete bid" },
      { status: 500 }
    );
  }
}
