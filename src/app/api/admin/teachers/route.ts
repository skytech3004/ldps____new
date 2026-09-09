import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeacherModel } from "@/models/Teacher";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await TeacherModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch teacher roster.";
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

    const created = await TeacherModel.create({
      name: String(body.name).trim(),
      designation: String(body.designation).trim(),
      image: body.image ? String(body.image).trim() : "",
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create teacher.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (Array.isArray(body)) {
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const id = item._id || item.id;
        if (id) {
          await TeacherModel.findByIdAndUpdate(id, {
            name: String(item.name).trim(),
            designation: String(item.designation).trim(),
            image: item.image ? String(item.image).trim() : "",
            sortOrder: i,
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    const id = body._id || body.id;
    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required." }, { status: 400 });
    }

    const updated = await TeacherModel.findByIdAndUpdate(
      id,
      {
        name: String(body.name).trim(),
        designation: String(body.designation).trim(),
        image: body.image ? String(body.image).trim() : "",
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Teacher member not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update teacher member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body._id || body.id;

    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required." }, { status: 400 });
    }

    const deleted = await TeacherModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Teacher member not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete teacher member.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
