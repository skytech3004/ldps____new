import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MagazineModel } from "@/models/Magazine";

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await MagazineModel.findById(id).lean();
      return NextResponse.json(item);
    }

    const items = await MagazineModel.find().lean();
    
    // Sort programmatically by Year descending, then Month descending (December first)
    items.sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      return MONTH_ORDER.indexOf(b.month) - MONTH_ORDER.indexOf(a.month);
    });

    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch magazines.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.pdfUrl || !body.year || !body.month) {
      return NextResponse.json({ error: "Missing required fields (name, pdfUrl, year, month)." }, { status: 400 });
    }

    const created = await MagazineModel.create({
      name: body.name,
      pdfUrl: body.pdfUrl,
      year: Number(body.year),
      month: body.month,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create magazine.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Magazine ID is required." }, { status: 400 });
    }

    if (!body.name || !body.pdfUrl || !body.year || !body.month) {
      return NextResponse.json({ error: "Missing required fields (name, pdfUrl, year, month)." }, { status: 400 });
    }

    const updated = await MagazineModel.findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        pdfUrl: body.pdfUrl,
        year: Number(body.year),
        month: body.month,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Magazine not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update magazine.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Magazine ID is required." }, { status: 400 });
    }

    const deleted = await MagazineModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Magazine not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete magazine.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
