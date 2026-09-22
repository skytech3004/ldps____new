import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { NonBoardResultModel } from "@/models/NonBoardResult";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    const filter: Record<string, any> = {};
    if (year) {
      filter.year = year;
    }

    const results = await NonBoardResultModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch non-board results.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Result title / name is required." }, { status: 400 });
    }

    const created = await NonBoardResultModel.create({
      title: body.title.trim(),
      year: body.year?.trim() || "2024-25",
      classLevel: body.classLevel?.trim() || "General",
      imageUrl: body.imageUrl?.trim() || "",
      pdfUrl: body.pdfUrl?.trim() || "",
      description: body.description?.trim() || "",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create non-board result.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
    }

    const updated = await NonBoardResultModel.findByIdAndUpdate(
      body.id,
      {
        title: body.title?.trim(),
        year: body.year?.trim(),
        classLevel: body.classLevel?.trim(),
        imageUrl: body.imageUrl?.trim(),
        pdfUrl: body.pdfUrl?.trim(),
        description: body.description?.trim(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update non-board result.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Record ID is required." }, { status: 400 });
    }

    const deleted = await NonBoardResultModel.findByIdAndDelete(body.id);
    if (!deleted) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete non-board result.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
