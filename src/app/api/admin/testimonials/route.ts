import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TestimonialModel } from "@/models/Testimonial";

const DEFAULT_TESTIMONIALS = [
  {
    quote: "LPS Vidyawadi has exceeded our expectations. The 65-acre secure campus, professional warden care, and outstanding CBSE curriculum gave our daughter the perfect foundation to grow into an independent leader.",
    name: "Sunita Choudhary",
    role: "Parent of Class XI Student",
    location: "Jodhpur, Rajasthan",
    rating: 5,
    sortOrder: 1,
    status: "active",
  },
  {
    quote: "Leaving our daughter at a hostel was a tough choice, but LPS Vidyawadi felt like a second home. The focus on values, sports, horse riding, and individual academic care is truly exceptional.",
    name: "Rajesh Sharma",
    role: "Parent of Class IX Student",
    location: "Mumbai, Maharashtra",
    rating: 5,
    sortOrder: 2,
    status: "active",
  },
  {
    quote: "My years at LPS Vidyawadi defined my path. The leadership opportunities, debate circles, and holistic education shaped me. It is more than a school; it is an ecosystem of excellence.",
    name: "Dr. Ananya R.",
    role: "Alumni (Batch 2021)",
    location: "Delhi, India",
    rating: 5,
    sortOrder: 3,
    status: "active",
  },
];

function clean(body: Record<string, unknown>) {
  const rating = Number(body.rating);
  return {
    quote: String(body.quote || "").trim(),
    name: String(body.name || "").trim(),
    role: String(body.role || "").trim(),
    location: String(body.location || "").trim(),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
    sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    status: body.status === "inactive" ? "inactive" : "active",
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    if ((await TestimonialModel.estimatedDocumentCount()) === 0) {
      await TestimonialModel.insertMany(DEFAULT_TESTIMONIALS);
    }
    const items = await TestimonialModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch testimonials.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = clean(await request.json());
    if (!data.quote || !data.name || !data.role) {
      return NextResponse.json({ error: "Quote, name, and role are required." }, { status: 400 });
    }
    if (!data.sortOrder) {
      const highest = await TestimonialModel.findOne().sort({ sortOrder: -1 }).lean();
      data.sortOrder = highest && typeof highest.sortOrder === "number" ? highest.sortOrder + 1 : 1;
    }
    const created = await TestimonialModel.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body._id || body.id;
    if (!id) return NextResponse.json({ error: "Testimonial ID is required." }, { status: 400 });
    const data = clean(body);
    if (!data.quote || !data.name || !data.role) {
      return NextResponse.json({ error: "Quote, name, and role are required." }, { status: 400 });
    }
    const updated = await TestimonialModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body._id || body.id;
    if (!id) return NextResponse.json({ error: "Testimonial ID is required." }, { status: 400 });
    const deleted = await TestimonialModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Testimonial not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete testimonial.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
