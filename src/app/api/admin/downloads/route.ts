import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DownloadModel } from "@/models/Download";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await DownloadModel.findById(id).lean();
      return NextResponse.json(item);
    }

    const items = await DownloadModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch downloads.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.pdfUrl || !body.filename) {
      return NextResponse.json({ error: "Missing required fields (title, pdfUrl, filename)." }, { status: 400 });
    }

    const created = await DownloadModel.create({
      title: body.title,
      description: body.description ?? "",
      filename: body.filename,
      fileSize: body.fileSize ?? "",
      pdfUrl: body.pdfUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create download.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Download ID is required." }, { status: 400 });
    }

    if (!body.title || !body.pdfUrl || !body.filename) {
      return NextResponse.json({ error: "Missing required fields (title, pdfUrl, filename)." }, { status: 400 });
    }

    const updated = await DownloadModel.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        description: body.description ?? "",
        filename: body.filename,
        fileSize: body.fileSize ?? "",
        pdfUrl: body.pdfUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update download.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Download ID is required." }, { status: 400 });
    }

    const deleted = await DownloadModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Download not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete download.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
