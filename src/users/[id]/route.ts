import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const users = await db.collection("users").find({}).toArray();
    
    return NextResponse.json({ users });
  } catch (error) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  }