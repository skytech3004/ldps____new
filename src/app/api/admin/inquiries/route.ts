import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { InquiryModel } from "@/models/Inquiry";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await InquiryModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch inquiries.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const created = await InquiryModel.create({
      parentName: body.parentName,
      studentName: body.studentName,
      contactNo: body.contactNo,
      emailId: body.emailId,
      classApplied: body.classApplied,
      streamSelected: body.streamSelected ?? "",
      address: body.address ?? "",
      reason: body.reason ?? "",
      status: "New Inquiry",
      notes: ""
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
    }

    const updated = await InquiryModel.findByIdAndUpdate(
      body.id,
      {
        status: body.status,
        notes: body.notes ?? ""
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
    }

    const deleted = await InquiryModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
