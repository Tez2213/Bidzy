import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    envCheck: {
      googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
      googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
      nextAuthUrlSet: !!process.env.NEXTAUTH_URL,
      nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
    }
  });
}