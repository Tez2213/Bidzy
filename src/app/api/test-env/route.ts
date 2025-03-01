import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    // Don't include actual secrets, just check if they exist
    googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    databaseUrl: !!process.env.DATABASE_URL,
  });
}