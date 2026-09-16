import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TrustMemberModel } from "@/models/TrustMember";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await TrustMemberModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch trust members.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
