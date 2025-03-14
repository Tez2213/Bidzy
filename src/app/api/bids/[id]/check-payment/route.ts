import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bidId = params.id;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      // Check if user has already paid for this bid
      const payment = await prisma.bidPayment.findFirst({
        where: {
          bidId: bidId,
          userId: session.user.id,
          status: "completed",
        },
      });

      return NextResponse.json({
        hasPaid: !!payment,
        paymentId: payment?.id || null,
      });
    } catch (modelError) {
      // If the model doesn't exist yet, assume not paid
      console.log("Payment model error:", modelError);
      return NextResponse.json({
        hasPaid: false,
        paymentId: null,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { message: "Failed to check payment status", error: String(error) },
      { status: 500 }
    );
  }
}
