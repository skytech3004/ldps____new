import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BrandModel } from "@/models/Brand";
import { publicCacheHeaders } from "@/lib/publicCache";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const item = await BrandModel.findOne({ key }).lean();
      return NextResponse.json(item || { key, value: "" }, { headers: publicCacheHeaders });
    }

    const items = await BrandModel.find({}).select("key value alt").lean();
    return NextResponse.json(items, { headers: publicCacheHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch brand items.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.key || !body.value) {
      return NextResponse.json(
        { error: "Missing required fields: key, value" },
        { status: 400 }
      );
    }

    const item = await BrandModel.findOneAndUpdate(
      { key: body.key },
      { value: body.value, alt: body.alt || "" },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update brand item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
