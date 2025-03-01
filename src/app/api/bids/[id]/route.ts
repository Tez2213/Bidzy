import { NextResponse } from "next/server";

// Temporarily remove Prisma dependency for deployment
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    id: params.id,
    title: "Sample Bid",
    status: "temporary",
    message:
      "This is a placeholder during deployment. Real data will be available soon.",
  });
}

export async function PUT() {
  return NextResponse.json({ message: "Update functionality coming soon" });
}

export async function DELETE() {
  return NextResponse.json({ message: "Delete functionality coming soon" });
}
