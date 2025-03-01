import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Payment API is available",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Process payment logic would go here

    return NextResponse.json({
      success: true,
      message: "Payment intent created",
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { success: false, message: "Payment failed" },
      { status: 500 }
    );
  }
}
