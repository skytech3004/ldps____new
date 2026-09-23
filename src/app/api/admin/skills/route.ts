import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SkillModel } from "@/models/Skill";

const DEFAULT_SKILLS = [
  "Artificial Intelligence",
  "Financial Literacy",
  "Rockets",
  "Satellites",
  "Marketing",
  "Digital Citizenship",
  "Handicraft",
  "Block Printing",
  "Design Thinking",
  "What to do when doctor",
  "Tourism",
  "Beauty and Wellness",
].map((name, index) => ({
  name,
  image: "",
  sortOrder: index + 1,
  status: "active",
}));

async function seedDefaultSkills() {
  const count = await SkillModel.estimatedDocumentCount();
  if (count === 0) {
    await SkillModel.insertMany(DEFAULT_SKILLS);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedDefaultSkills();
    const skills = await SkillModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(skills);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch skill courses.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ error: "Skill name is required." }, { status: 400 });
    }

    let sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(sortOrder)) {
      const highest = await SkillModel.findOne().sort({ sortOrder: -1 }).lean();
      sortOrder = highest && typeof highest.sortOrder === "number" ? highest.sortOrder + 1 : 1;
    }

    const created = await SkillModel.create({
      name: String(body.name).trim(),
      image: body.image ? String(body.image).trim() : "",
      sortOrder,
      status: body.status === "inactive" ? "inactive" : "active",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create skill course.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Batch reordering
    if (Array.isArray(body)) {
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const id = item._id || item.id;
        if (id) {
          await SkillModel.findByIdAndUpdate(id, {
            sortOrder: i + 1,
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    const id = body._id || body.id;
    if (!id) {
      return NextResponse.json({ error: "Skill ID is required." }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.image !== undefined) updateData.image = String(body.image).trim();
    if (body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))) {
      updateData.sortOrder = Number(body.sortOrder);
    }
    if (body.status !== undefined) {
      updateData.status = body.status === "inactive" ? "inactive" : "active";
    }

    const updated = await SkillModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Skill course not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update skill course.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body._id || body.id;

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required." }, { status: 400 });
    }

    const deleted = await SkillModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Skill course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete skill course.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
