import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClubModel } from "@/models/Club";

const DEFAULT_CLUBS = [
  "LEGAL AWARENESS",
  "N.C.C.",
  "GUIDE + BULBUL",
  "ROAD SAFETY",
  "LITERARY",
  "MATHS",
  "LIFE SKILL",
  "RED CROSS",
  "ECO",
  "I.T.",
  "ORATORY",
  "HERITAGE",
  "ART & CRAFT",
  "EK BHARAT SHRESTH BHARAT",
  "CULTURAL",
  "MUSIC",
  "SCIENCE",
  "READERS",
  "DANCE",
  "THEATER & DRAMA",
  "SWACHHA VIDYALAYA",
  "SUPW",
  "CYBER CLUB",
  "SANSKRIT",
  "KIDS",
  "Sports",
  "Yuva Tourism",
  "Electoral Literacy Club",
].map((name, index) => ({
  name,
  sortOrder: index + 1,
  status: "active",
}));

async function seedDefaultClubs() {
  const count = await ClubModel.estimatedDocumentCount();
  if (count === 0) {
    await ClubModel.insertMany(DEFAULT_CLUBS);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedDefaultClubs();
    const clubs = await ClubModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(clubs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch clubs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ error: "Club name is required." }, { status: 400 });
    }

    let sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(sortOrder)) {
      const highest = await ClubModel.findOne().sort({ sortOrder: -1 }).lean();
      sortOrder = highest && typeof highest.sortOrder === "number" ? highest.sortOrder + 1 : 1;
    }

    const created = await ClubModel.create({
      name: String(body.name).trim(),
      sortOrder,
      status: body.status === "inactive" ? "inactive" : "active",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create club.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Handle batch reordering array
    if (Array.isArray(body)) {
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const id = item._id || item.id;
        if (id) {
          await ClubModel.findByIdAndUpdate(id, {
            sortOrder: i + 1,
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    const id = body._id || body.id;
    if (!id) {
      return NextResponse.json({ error: "Club ID is required." }, { status: 400 });
    }

    const existing = await ClubModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))) {
      updateData.sortOrder = Number(body.sortOrder);
    }
    if (body.status !== undefined) {
      updateData.status = body.status === "inactive" ? "inactive" : "active";
    }

    const updated = await ClubModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update club.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body._id || body.id;

    if (!id) {
      return NextResponse.json({ error: "Club ID is required." }, { status: 400 });
    }

    const deleted = await ClubModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Club not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete club.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
