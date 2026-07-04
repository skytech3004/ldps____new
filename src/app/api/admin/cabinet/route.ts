import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CabinetMemberModel } from "@/models/CabinetMember";
import { defaultCabinetMembers } from "@/data/cabinetMembers";

async function seedCabinetMembers() {
  const count = await CabinetMemberModel.estimatedDocumentCount();
  if (count === 0) {
    await CabinetMemberModel.insertMany(defaultCabinetMembers);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedCabinetMembers();
    const items = await CabinetMemberModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch cabinet members.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.role) {
      return NextResponse.json({ error: "Name and role are required." }, { status: 400 });
    }

    const created = await CabinetMemberModel.create({
      name: body.name,
      role: body.role,
      image: body.image || "",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create cabinet member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }

    const updated = await CabinetMemberModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        role: body.role,
        image: body.image ?? "",
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Cabinet member not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update cabinet member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
    }

    const deleted = await CabinetMemberModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Cabinet member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete cabinet member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
