import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SchoolFeeModel } from "@/models/SchoolFee";

const defaultSchoolFees = [
  { classLevel: "Nursery", annualFee: "₹17,700", installment: "₹8,850", sortOrder: 1 },
  { classLevel: "KG-Prep", annualFee: "₹18,400", installment: "₹9,200", sortOrder: 2 },
  { classLevel: "Class I – II", annualFee: "₹21,300", installment: "₹10,650", sortOrder: 3 },
  { classLevel: "Class III – IV", annualFee: "₹21,300", installment: "₹10,650", sortOrder: 4 },
  { classLevel: "Class V", annualFee: "₹29,300", installment: "₹14,650", sortOrder: 5 },
  { classLevel: "Class VI", annualFee: "₹30,800", installment: "₹15,400", sortOrder: 6 },
  { classLevel: "Class VII – VIII", annualFee: "₹34,900", installment: "₹17,450", sortOrder: 7 },
  { classLevel: "Class IX – X", annualFee: "₹36,000", installment: "₹18,000", sortOrder: 8 },
  { classLevel: "Class XI – XII (Science - PCM)", annualFee: "₹49,600", installment: "₹24,800", sortOrder: 9 },
  { classLevel: "Class XI – XII (Science - PCB)", annualFee: "₹52,200", installment: "₹26,100", sortOrder: 10 },
  { classLevel: "Class XI – XII (Science - General)", annualFee: "₹41,200", installment: "₹20,600", sortOrder: 11 },
  { classLevel: "Class XI – XII (Commerce - Comp. Sc.)", annualFee: "₹42,400", installment: "₹21,200", sortOrder: 12 },
  { classLevel: "Class XI – XII (Commerce - General)", annualFee: "₹41,500", installment: "₹20,750", sortOrder: 13 },
  { classLevel: "Class XI – XII (Arts)", annualFee: "₹43,600", installment: "₹21,800", sortOrder: 14 },
];

async function seedSchoolFees() {
  if (await SchoolFeeModel.estimatedDocumentCount() === 0) {
    await SchoolFeeModel.insertMany(defaultSchoolFees);
  }
}

function feePayload(body: Record<string, unknown>) {
  return {
    classLevel: String(body.classLevel || "").trim(),
    annualFee: String(body.annualFee || "").trim(),
    installment: String(body.installment || "").trim(),
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

function hasRequiredFees(fee: ReturnType<typeof feePayload>) {
  return fee.classLevel && fee.annualFee && fee.installment;
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedSchoolFees();
    const fees = await SchoolFeeModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(fees);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch school fees.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const fee = feePayload(await request.json());
    if (!hasRequiredFees(fee)) {
      return NextResponse.json({ error: "Class, annual fee, and installment are required." }, { status: 400 });
    }
    return NextResponse.json(await SchoolFeeModel.create(fee), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create school fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID is required for editing." }, { status: 400 });
    const fee = feePayload(body);
    if (!hasRequiredFees(fee)) {
      return NextResponse.json({ error: "Class, annual fee, and installment are required." }, { status: 400 });
    }
    const updated = await SchoolFeeModel.findByIdAndUpdate(body.id, fee, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "School fee not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update school fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required for deletion." }, { status: 400 });
    const deleted = await SchoolFeeModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "School fee not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete school fee.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
