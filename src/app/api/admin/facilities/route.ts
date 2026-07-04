import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FacilityModel } from "@/models/Facility";
import { defaultFacilities } from "@/data/facilities";

async function seedFacilities() {
  const count = await FacilityModel.estimatedDocumentCount();
  if (count === 0) {
    await FacilityModel.insertMany(defaultFacilities);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedFacilities();
    const items = await FacilityModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch facilities.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: "Facility name is required." }, { status: 400 });
    }

    const created = await FacilityModel.create({
      name: body.name,
      fallback: body.fallback || "/lps-vidhyawadi/gallery-01.jpg",
      code: body.code || "",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create facility.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Facility ID is required." }, { status: 400 });
    }

    const updated = await FacilityModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        fallback: body.fallback ?? "/lps-vidhyawadi/gallery-01.jpg",
        code: body.code ?? "",
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Facility not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update facility.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Facility ID is required." }, { status: 400 });
    }

    const deleted = await FacilityModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Facility not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete facility.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
