import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FilterModel } from "@/models/Filter";

// Default filters to seed if none exist
const DEFAULT_FILTERS = {
  gallery: ["Events", "Fun & Food Fest", "Hostel", "Infrastructure", "Laboratories"],
  blog: ["Academic", "Events", "Hostel", "Others"],
  hostel: ["Rooms", "Mess", "Campus"]
};

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query = {};
    if (type) {
      query = { type };
    }

    let filters = await FilterModel.find(query).sort({ name: 1 });

    // Seed defaults if database is empty for the requested type
    if (filters.length === 0) {
      if (type && type in DEFAULT_FILTERS) {
        const defaults = DEFAULT_FILTERS[type as keyof typeof DEFAULT_FILTERS];
        const seedData = defaults.map(name => ({ name, type }));
        await FilterModel.insertMany(seedData);
        filters = await FilterModel.find(query).sort({ name: 1 });
      } else if (!type) {
        // Seed all types
        for (const [t, names] of Object.entries(DEFAULT_FILTERS)) {
          const count = await FilterModel.countDocuments({ type: t });
          if (count === 0) {
            const seedData = names.map(name => ({ name, type: t }));
            await FilterModel.insertMany(seedData);
          }
        }
        filters = await FilterModel.find(query).sort({ name: 1 });
      }
    }

    return NextResponse.json(filters);
  } catch (error: any) {
    console.error("GET filters error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch filters" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, type } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    // Trim and normalize name
    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    // Check if duplicate exists
    const existing = await FilterModel.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      type
    });

    if (existing) {
      return NextResponse.json(existing); // Return existing instead of throwing an error for a better user experience
    }

    const newFilter = await FilterModel.create({ name: trimmedName, type });
    return NextResponse.json(newFilter, { status: 201 });
  } catch (error: any) {
    console.error("POST filter error:", error);
    return NextResponse.json({ error: error.message || "Failed to create filter" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Filter ID is required" }, { status: 400 });
    }

    const deleted = await FilterModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Filter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Filter deleted successfully" });
  } catch (error: any) {
    console.error("DELETE filter error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete filter" }, { status: 500 });
  }
}
