import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { LeadershipMemberModel } from "@/models/LeadershipMember";
import { defaultLeadershipMembers } from "@/data/leadershipMembers";

async function seedLeadershipMembers() {
  const count = await LeadershipMemberModel.estimatedDocumentCount();
  if (count === 0) {
    await LeadershipMemberModel.insertMany(defaultLeadershipMembers);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedLeadershipMembers();
    const items = await LeadershipMemberModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch leadership members.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.designation) {
      return NextResponse.json({ error: "Name and designation are required." }, { status: 400 });
    }

    const created = await LeadershipMemberModel.create({
      name: body.name,
      designation: body.designation,
      image: body.image || "",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create leadership member.";
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

    const updated = await LeadershipMemberModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        designation: body.designation,
        image: body.image ?? "",
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Leadership member not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update leadership member.";
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

    const deleted = await LeadershipMemberModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Leadership member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete leadership member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
