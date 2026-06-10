import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DisclosureDocumentModel } from "@/models/DisclosureDocument";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await DisclosureDocumentModel.findById(id).lean();
      return NextResponse.json(item);
    }

    const items = await DisclosureDocumentModel.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch disclosures.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.pdfUrl) {
      return NextResponse.json({ error: "Missing required fields (title, pdfUrl)." }, { status: 400 });
    }

    const created = await DisclosureDocumentModel.create({
      title: body.title,
      pdfUrl: body.pdfUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create disclosure.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Disclosure ID is required." }, { status: 400 });
    }

    if (!body.title || !body.pdfUrl) {
      return NextResponse.json({ error: "Missing required fields (title, pdfUrl)." }, { status: 400 });
    }

    const updated = await DisclosureDocumentModel.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        pdfUrl: body.pdfUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Disclosure not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update disclosure.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Disclosure ID is required." }, { status: 400 });
    }

    const deleted = await DisclosureDocumentModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Disclosure not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete disclosure.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
