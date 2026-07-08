import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { JobOpeningModel, JobApplicationModel } from "@/models/Career";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");

    if (view === "applications") {
      const items = await JobApplicationModel.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(items);
    }

    const items = await JobOpeningModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch admin career data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.department) {
      return NextResponse.json({ error: "Title and Department are required." }, { status: 400 });
    }

    const created = await JobOpeningModel.create({
      title: body.title,
      department: body.department,
      experience: body.experience || "",
      qualification: body.qualification || "",
      description: body.description || "",
      requirements: body.requirements || [],
      salary: body.salary || "As per school norms",
      isActive: body.isActive !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create job opening.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    const updated = await JobOpeningModel.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        department: body.department,
        experience: body.experience,
        qualification: body.qualification,
        description: body.description,
        requirements: body.requirements || [],
        salary: body.salary,
        isActive: body.isActive,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Job opening not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update job opening.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view");
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    let deleted = null;
    if (view === "applications") {
      deleted = await JobApplicationModel.findByIdAndDelete(body.id);
    } else {
      deleted = await JobOpeningModel.findByIdAndDelete(body.id);
    }

    if (!deleted) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
