import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { WriterModel } from "@/models/Writer";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await WriterModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch writers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Writer name is required." }, { status: 400 });
    }

    const created = await WriterModel.create({
      name: body.name.trim(),
      image: body.image ? body.image.trim() : "",
      designation: body.designation ? body.designation.trim() : "Author",
      bio: body.bio ? body.bio.trim() : "",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create writer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Writer ID is required." }, { status: 400 });
    }

    const updated = await WriterModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name.trim(),
        image: body.image ? body.image.trim() : "",
        designation: body.designation ? body.designation.trim() : "Author",
        bio: body.bio ? body.bio.trim() : "",
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Writer not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update writer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Writer ID is required." }, { status: 400 });
    }

    const deleted = await WriterModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Writer not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete writer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
