import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BusFeeModel } from "@/models/BusFee";

const defaultBusFees = [
  { sNo: 1, place: "Aana", fee: "₹28,500", sortOrder: 1 },
  { sNo: 2, place: "Akrawas", fee: "₹14,400", sortOrder: 2 },
  { sNo: 3, place: "Anand Dham", fee: "₹21,300", sortOrder: 3 },
  { sNo: 4, place: "Baba Gaon", fee: "₹29,800", sortOrder: 4 },
  { sNo: 5, place: "Badod", fee: "₹27,900", sortOrder: 5 },
  { sNo: 6, place: "Bali, Radawa", fee: "₹26,000", sortOrder: 6 },
  { sNo: 7, place: "Balrai", fee: "₹26,400", sortOrder: 7 },
  { sNo: 8, place: "Bamniya", fee: "₹19,200", sortOrder: 8 },
  { sNo: 9, place: "Bangri", fee: "₹24,100", sortOrder: 9 },
  { sNo: 10, place: "Barwa", fee: "₹28,500", sortOrder: 10 },
  { sNo: 11, place: "Basant", fee: "₹30,900", sortOrder: 11 },
  { sNo: 12, place: "Bhagwanpura", fee: "₹20,900", sortOrder: 12 },
  { sNo: 13, place: "Bhitwada", fee: "₹25,200", sortOrder: 13 },
  { sNo: 14, place: "Bijapur", fee: "₹35,100", sortOrder: 14 },
  { sNo: 15, place: "Bijowa", fee: "₹21,300", sortOrder: 15 },
  { sNo: 16, place: "Birami", fee: "₹21,300", sortOrder: 16 },
  { sNo: 17, place: "Birami Dhani", fee: "₹20,700", sortOrder: 17 },
  { sNo: 18, place: "Chanchodi", fee: "₹22,900", sortOrder: 18 },
  { sNo: 19, place: "Changwa (Kharokara)", fee: "₹16,900", sortOrder: 19 },
  { sNo: 20, place: "Choti Rani", fee: "₹16,800", sortOrder: 20 },
  { sNo: 21, place: "Dadai", fee: "₹24,600", sortOrder: 21 },
  { sNo: 22, place: "Desuri", fee: "₹31,500", sortOrder: 22 },
  { sNo: 23, place: "Devatra", fee: "₹22,100", sortOrder: 23 },
  { sNo: 24, place: "Dhalop", fee: "₹29,800", sortOrder: 24 },
  { sNo: 25, place: "Dhanda", fee: "₹22,900", sortOrder: 25 },
  { sNo: 26, place: "Dhani", fee: "₹19,200", sortOrder: 26 },
  { sNo: 27, place: "Dhola", fee: "₹24,600", sortOrder: 27 },
  { sNo: 28, place: "Falna", fee: "₹22,700", sortOrder: 28 },
  { sNo: 29, place: "Falna Dairy", fee: "₹21,300", sortOrder: 29 },
  { sNo: 30, place: "Falna Gaon", fee: "₹19,200", sortOrder: 30 },
  { sNo: 31, place: "Fatahpura", fee: "₹19,200", sortOrder: 31 },
  { sNo: 32, place: "Ghanerao", fee: "₹34,400", sortOrder: 32 },
  { sNo: 33, place: "Girali", fee: "₹28,500", sortOrder: 33 },
  { sNo: 34, place: "Guda Endla", fee: "₹31,500", sortOrder: 34 },
  { sNo: 35, place: "Guda Endla II", fee: "₹31,500", sortOrder: 35 },
  { sNo: 36, place: "Guda Kesharsingh", fee: "₹15,500", sortOrder: 36 },
  { sNo: 37, place: "Guda Laas", fee: "₹22,100", sortOrder: 37 },
  { sNo: 38, place: "Guda Mehram", fee: "₹13,900", sortOrder: 38 },
  { sNo: 39, place: "Itandra Charnan", fee: "₹19,800", sortOrder: 39 },
  { sNo: 40, place: "Itandra Mertiyan", fee: "₹27,300", sortOrder: 40 },
  { sNo: 41, place: "Jawali", fee: "₹26,400", sortOrder: 41 },
  { sNo: 42, place: "Jeevan Khurd", fee: "₹15,500", sortOrder: 42 },
  { sNo: 43, place: "Jeevan", fee: "₹15,900", sortOrder: 43 },
  { sNo: 44, place: "Kanpura", fee: "₹35,700", sortOrder: 44 },
  { sNo: 45, place: "Karnawa", fee: "₹31,500", sortOrder: 45 },
  { sNo: 46, place: "Kharda", fee: "₹14,900", sortOrder: 46 },
  { sNo: 47, place: "Kharokara", fee: "₹15,900", sortOrder: 47 },
  { sNo: 48, place: "Khimada", fee: "₹13,300", sortOrder: 48 },
  { sNo: 49, place: "Khimel", fee: "₹8,500", sortOrder: 49 },
  { sNo: 50, place: "Khimel Fatak", fee: "₹8,700", sortOrder: 50 },
  { sNo: 51, place: "Khod", fee: "₹18,700", sortOrder: 51 },
  { sNo: 52, place: "Khudala", fee: "₹12,200", sortOrder: 52 },
  { sNo: 53, place: "Khuni ka Guda", fee: "₹14,800", sortOrder: 53 },
  { sNo: 54, place: "Kirva", fee: "₹14,500", sortOrder: 54 },
  { sNo: 55, place: "Koseloa", fee: "₹14,500", sortOrder: 55 },
  { sNo: 56, place: "Kot", fee: "₹14,600", sortOrder: 56 },
  { sNo: 57, place: "Lunawa", fee: "₹14,900", sortOrder: 57 },
  { sNo: 58, place: "Mada", fee: "₹16,700", sortOrder: 58 },
  { sNo: 59, place: "Mandal", fee: "₹12,100", sortOrder: 59 },
  { sNo: 60, place: "Mataji Wada", fee: "₹13,400", sortOrder: 60 },
  { sNo: 61, place: "Mirgeshwar", fee: "₹16,300", sortOrder: 61 },
  { sNo: 62, place: "Mokampura", fee: "₹9,000", sortOrder: 62 },
  { sNo: 63, place: "Mundara", fee: "₹14,900", sortOrder: 63 },
  { sNo: 64, place: "Nadana Bhatan", fee: "₹12,400", sortOrder: 64 },
  { sNo: 65, place: "Nadol", fee: "₹13,800", sortOrder: 65 },
  { sNo: 66, place: "Narlai", fee: "₹15,100", sortOrder: 66 },
  { sNo: 67, place: "Netra", fee: "₹15,200", sortOrder: 67 },
  { sNo: 68, place: "Nipal", fee: "₹16,500", sortOrder: 68 },
  { sNo: 69, place: "Padarla", fee: "₹17,600", sortOrder: 69 },
  { sNo: 70, place: "Padarli", fee: "₹10,600", sortOrder: 70 },
  { sNo: 71, place: "Patawa", fee: "₹15,800", sortOrder: 71 },
  { sNo: 72, place: "Pawa", fee: "₹16,300", sortOrder: 72 },
  { sNo: 73, place: "Punadiya", fee: "₹11,200", sortOrder: 73 },
  { sNo: 74, place: "Rani", fee: "₹8,700", sortOrder: 74 },
  { sNo: 75, place: "Rani Gaon", fee: "₹9,400", sortOrder: 75 },
  { sNo: 76, place: "Sadri", fee: "₹17,700", sortOrder: 76 },
  { sNo: 77, place: "Salriya", fee: "₹16,100", sortOrder: 77 },
  { sNo: 78, place: "Sanderao", fee: "₹13,400", sortOrder: 78 },
  { sNo: 79, place: "Sartur", fee: "₹14,600", sortOrder: 79 },
  { sNo: 80, place: "Sewari", fee: "₹16,200", sortOrder: 80 },
  { sNo: 81, place: "Sheoganj", fee: "₹18,400", sortOrder: 81 },
  { sNo: 82, place: "Shivatlav", fee: "₹15,700", sortOrder: 82 },
  { sNo: 83, place: "Shri Sela", fee: "₹13,000", sortOrder: 83 },
  { sNo: 84, place: "Sindharu", fee: "₹14,500", sortOrder: 84 },
  { sNo: 85, place: "Sindrali", fee: "₹15,700", sortOrder: 85 },
  { sNo: 86, place: "Sonana Khetlaji", fee: "₹16,600", sortOrder: 86 },
  { sNo: 87, place: "Sumerpur", fee: "₹17,700", sortOrder: 87 },
  { sNo: 88, place: "Undarthala", fee: "₹14,400", sortOrder: 88 },
  { sNo: 89, place: "Varka", fee: "₹12,800", sortOrder: 89 },
  { sNo: 90, place: "Varkana", fee: "₹12,100", sortOrder: 90 },
  { sNo: 91, place: "Vingarla", fee: "₹12,500", sortOrder: 91 },
];

async function seedBusFees() {
  if ((await BusFeeModel.estimatedDocumentCount()) === 0) {
    await BusFeeModel.insertMany(defaultBusFees);
  }
}

function busFeePayload(body: Record<string, unknown>) {
  return {
    sNo: Number.isFinite(Number(body.sNo)) ? Number(body.sNo) : 1,
    place: String(body.place || "").trim(),
    fee: String(body.fee || "").trim(),
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
  };
}

function hasRequiredBusFee(item: ReturnType<typeof busFeePayload>) {
  return item.place && item.fee;
}

export async function GET() {
  try {
    await connectToDatabase();
    await seedBusFees();
    const busFees = await BusFeeModel.find().sort({ sNo: 1, sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(busFees);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch bus fees.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const payload = busFeePayload(await request.json());
    if (!hasRequiredBusFee(payload)) {
      return NextResponse.json({ error: "Place and fee are required." }, { status: 400 });
    }
    const created = await BusFeeModel.create(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create bus fee record.";
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
    const payload = busFeePayload(body);
    if (!hasRequiredBusFee(payload)) {
      return NextResponse.json({ error: "Place and fee are required." }, { status: 400 });
    }
    const updated = await BusFeeModel.findByIdAndUpdate(body.id, payload, { new: true, runValidators: true });
    if (!updated) {
      return NextResponse.json({ error: "Bus fee record not found." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update bus fee record.";
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
    const deleted = await BusFeeModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Bus fee record not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete bus fee record.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
