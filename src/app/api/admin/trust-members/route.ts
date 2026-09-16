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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.title || !body.image) {
      return NextResponse.json({ error: "Name, Heading/Title, and Image are required." }, { status: 400 });
    }

    const created = await TrustMemberModel.create({
      name: body.name.trim(),
      title: body.title.trim(),
      image: body.image.trim(),
      sortOrder: Number(body.sortOrder ?? 0),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create trust member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Trust member ID is required." }, { status: 400 });
    }

    const updated = await TrustMemberModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name.trim(),
        title: body.title.trim(),
        image: body.image.trim(),
        sortOrder: Number(body.sortOrder ?? 0),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Trust member not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update trust member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Trust member ID is required." }, { status: 400 });
    }

    const deleted = await TrustMemberModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Trust member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete trust member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
