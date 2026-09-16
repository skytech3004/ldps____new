import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AdmissionFeeModel } from "@/models/AdmissionFee";

const defaultAdmissionFees = [
  {
    category: "Nursery to Class V",
    feeAmount: "₹2,000",
    note: "Charged only once at the time of new admission into the school.",
    sortOrder: 1,
  },
  {
    category: "Class VI to XII",
    feeAmount: "₹4,000",
    note: "Charged only once at the time of new admission into the school.",
    sortOrder: 2,
  },
];

async function seedAdmissionFees() {
  if ((await AdmissionFeeModel.estimatedDocumentCount()) === 0) {
    await AdmissionFeeModel.insertMany(defaultAdmissionFees);
  }
}

function payload(body: Record<string, unknown>) {
  return {
    category: String(body.category || "").trim(),
    feeAmount: String(body.feeAmount || "").trim(),
    note: String(body.note || "Charged only once at the time of new admission into the school.").trim(),
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

function hasRequiredFields(item: ReturnType<typeof payload>) {
  return Boolean(item.category && item.feeAmount);
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedAdmissionFees();
    const items = await AdmissionFeeModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch admission fees.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const item = payload(await request.json());
    if (!hasRequiredFields(item)) {
      return NextResponse.json({ error: "Category and fee amount are required." }, { status: 400 });
    }
    const created = await AdmissionFeeModel.create(item);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create admission fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required for editing." }, { status: 400 });
    }
    const item = payload(body);
    if (!hasRequiredFields(item)) {
      return NextResponse.json({ error: "Category and fee amount are required." }, { status: 400 });
    }
    const updated = await AdmissionFeeModel.findByIdAndUpdate(body.id, item, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json({ error: "Admission fee not found." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update admission fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required for deletion." }, { status: 400 });
    }
    const deleted = await AdmissionFeeModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Admission fee not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete admission fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
