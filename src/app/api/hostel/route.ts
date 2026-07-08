import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HostelFacilityModel, HostelFeeModel, HostelRuleModel } from "@/models/Hostel";

const defaultFacilities = [
  { name: "Safety & CCTV", description: "Round-the-clock security with full CCTV coverage.", src: "/uploads/hostel/security.jpg", sortOrder: 1 },
  { name: "Pure Jain Food", description: "Nutritious Satvik meals with 5 servings per day.", src: "/uploads/hostel/jain_meals.png", sortOrder: 2 },
  { name: "RO Drinking Water", description: "Pure and safe RO purified drinking water available 24/7.", src: "/uploads/hostel/RO.jpg", sortOrder: 3 },
  { name: "Hot Water", description: "Constant supply of hot water during winter months.", src: "/uploads/hostel/HOT.jpg", sortOrder: 4 },
  { name: "Digital Library", description: "24/7 access to educational resources and quiet study space.", src: "/uploads/hostel/aa.jpg", sortOrder: 5 },
  { name: "Yoga & Meditation", description: "Daily morning sessions for physical and mental well-being.", src: "/uploads/hostel/yoga.jpeg", sortOrder: 6 },
  { name: "Sports Facilities", description: "International standard stadium and sports ground.", src: "/uploads/hostel/sport.jpg", sortOrder: 7 },
  { name: "Health Care 24x7", description: "On-campus medical assistance and annual checkups.", src: "/uploads/hostel/Health.jpg", sortOrder: 8 },
  { name: "AC / Air Cooled", description: "Well-ventilated rooms with central cooling options.", src: "/uploads/hostel/ac.jpg", sortOrder: 9 },
  { name: "Laundry Services", description: "Professional and hassle-free laundry services for all students.", src: "/uploads/hostel/laundry.jpg", sortOrder: 10 },
  { name: "Tuck Shop", description: "On-campus tuck shop for all daily essentials and stationery.", src: "/uploads/hostel/tuck.jpg", sortOrder: 11 }
];

const defaultFees = [
  { classLevel: "Nursery to Class 5", nonAcFee: "₹87,500 / Year", acFee: "₹1,20,500 / Year", sortOrder: 1 },
  { classLevel: "Class 6", nonAcFee: "₹87,500 / Year", acFee: "₹1,22,500 / Year", sortOrder: 2 },
  { classLevel: "Class 7 to 9", nonAcFee: "₹90,500 / Year", acFee: "₹1,22,500 / Year", sortOrder: 3 },
  { classLevel: "Class 10 to XII", nonAcFee: "₹95,500 / Year", acFee: "₹1,22,500 / Year", sortOrder: 4 },
  { classLevel: "College (UG/PG)", nonAcFee: "₹95,500 / Year", acFee: "₹1,22,500 / Year", sortOrder: 5 },
  { classLevel: "B.Ed (1st & 2nd Year)", nonAcFee: "₹95,500 / Year", acFee: "N/A", sortOrder: 6 },
  { classLevel: "B.Ed 3rd Year", nonAcFee: "₹61,500 / Year", acFee: "N/A", sortOrder: 7 },
  { classLevel: "B.Ed 4th Year", nonAcFee: "₹56,500 / Year", acFee: "N/A", sortOrder: 8 }
];

const defaultRules = [
  {
    category: "Entry Policy",
    title: "Entry Policy",
    bullets: [
      "Entry into Vidyawadi campus is strictly regulated. Parents/guardians must show a valid gate pass or verification ID.",
      "Visitor timings are limited to second Saturdays and designated holidays only."
    ],
    sortOrder: 1
  },
  {
    category: "Clothing and Uniform",
    title: "Clothing & Uniforms",
    bullets: [
      "All students must wear the designated school/hostel uniforms during academic and prep hours.",
      "Casual clothing must adhere to the institution's modesty standards."
    ],
    sortOrder: 2
  },
  {
    category: "Prohibited Items",
    title: "Prohibited Electronic items",
    bullets: [
      "Electronic gadgets (mobile phones, tablets, smart watches, music players) are strictly banned.",
      "Fine of ₹1000 and confiscation applies if electronic devices are found with a boarder.",
      "Valuable jewelry, extra cash, and expensive personal items are not allowed."
    ],
    sortOrder: 3
  },
  {
    category: "Leave Policy",
    title: "Leave Policy & Curfews",
    bullets: [
      "Leave of absence is granted only under medical emergency or pre-sanctioned family emergencies.",
      "Failing to return on the reopening day triggers a transit fine of ₹200 per day."
    ],
    sortOrder: 4
  }
];

async function seedHostelData() {
  const facilityCount = await HostelFacilityModel.estimatedDocumentCount();
  if (facilityCount === 0) {
    await HostelFacilityModel.insertMany(defaultFacilities);
  }
  const feeCount = await HostelFeeModel.estimatedDocumentCount();
  if (feeCount === 0) {
    await HostelFeeModel.insertMany(defaultFees);
  }
  const ruleCount = await HostelRuleModel.estimatedDocumentCount();
  if (ruleCount === 0) {
    await HostelRuleModel.insertMany(defaultRules);
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await seedHostelData();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "facilities") {
      const items = await HostelFacilityModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
      return NextResponse.json(items);
    } else if (type === "fees") {
      const items = await HostelFeeModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
      return NextResponse.json(items);
    } else if (type === "rules") {
      const items = await HostelRuleModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
      return NextResponse.json(items);
    }

    // Default: return everything for frontend rendering
    const facilities = await HostelFacilityModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    const fees = await HostelFeeModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    const rules = await HostelRuleModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();

    return NextResponse.json({ facilities, fees, rules });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch hostel content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const body = await request.json();

    if (type === "facilities") {
      if (!body.name || !body.src) {
        return NextResponse.json({ error: "Name and Image URL are required." }, { status: 400 });
      }
      const created = await HostelFacilityModel.create({
        name: body.name,
        description: body.description || "",
        src: body.src,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      });
      return NextResponse.json(created, { status: 201 });
    } else if (type === "fees") {
      if (!body.classLevel || !body.nonAcFee || !body.acFee) {
        return NextResponse.json({ error: "Class Level, Non-AC fee, and AC fee are required." }, { status: 400 });
      }
      const created = await HostelFeeModel.create({
        classLevel: body.classLevel,
        nonAcFee: body.nonAcFee,
        acFee: body.acFee,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      });
      return NextResponse.json(created, { status: 201 });
    } else if (type === "rules") {
      if (!body.category || !body.title) {
        return NextResponse.json({ error: "Category and Title are required." }, { status: 400 });
      }
      const created = await HostelRuleModel.create({
        category: body.category,
        title: body.title,
        bullets: body.bullets || [],
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      });
      return NextResponse.json(created, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type parameter." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID is required for editing." }, { status: 400 });
    }

    if (type === "facilities") {
      const updated = await HostelFacilityModel.findByIdAndUpdate(
        body.id,
        {
          name: body.name,
          description: body.description,
          src: body.src,
          sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        },
        { new: true, runValidators: true }
      );
      if (!updated) return NextResponse.json({ error: "Facility not found." }, { status: 404 });
      return NextResponse.json(updated);
    } else if (type === "fees") {
      const updated = await HostelFeeModel.findByIdAndUpdate(
        body.id,
        {
          classLevel: body.classLevel,
          nonAcFee: body.nonAcFee,
          acFee: body.acFee,
          sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        },
        { new: true, runValidators: true }
      );
      if (!updated) return NextResponse.json({ error: "Fee record not found." }, { status: 404 });
      return NextResponse.json(updated);
    } else if (type === "rules") {
      const updated = await HostelRuleModel.findByIdAndUpdate(
        body.id,
        {
          category: body.category,
          title: body.title,
          bullets: body.bullets || [],
          sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        },
        { new: true, runValidators: true }
      );
      if (!updated) return NextResponse.json({ error: "Rule not found." }, { status: 404 });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid type parameter." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID is required for deletion." }, { status: 400 });
    }

    let deleted = null;
    if (type === "facilities") {
      deleted = await HostelFacilityModel.findByIdAndDelete(body.id);
    } else if (type === "fees") {
      deleted = await HostelFeeModel.findByIdAndDelete(body.id);
    } else if (type === "rules") {
      deleted = await HostelRuleModel.findByIdAndDelete(body.id);
    } else {
      return NextResponse.json({ error: "Invalid type parameter." }, { status: 400 });
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
