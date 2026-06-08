import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GalleryModel } from "@/models/Gallery";

export async function GET() {
  try {
    await connectToDatabase();
    const galleries = await GalleryModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(galleries);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch galleries.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const gallery = await GalleryModel.create(body);
    return NextResponse.json(gallery);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create gallery.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Gallery ID is required for update." }, { status: 400 });
    }

    const updated = await GalleryModel.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update gallery.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Gallery ID is required for deletion." }, { status: 400 });
    }

    await GalleryModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Gallery deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete gallery.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
