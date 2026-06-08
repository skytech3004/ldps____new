import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MediaItemModel } from "@/models/MediaItem";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = {};
    if (type) {
      query = { type };
    }

    const items = await MediaItemModel.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch media items.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.title || !body.src || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields: title, src, type" },
        { status: 400 }
      );
    }

    const item = await MediaItemModel.create(body);
    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Media item ID is required for update." },
        { status: 400 }
      );
    }

    const updated = await MediaItemModel.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Media item ID is required for deletion." },
        { status: 400 }
      );
    }

    await MediaItemModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Media item deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
