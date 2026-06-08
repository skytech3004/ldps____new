import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CarouselModel } from "@/models/Carousel";

const defaultSlides = [
  { image: "/lps-vidhyawadi/about-banner.jpg", title: "Campus Banner", description: "LPS Vidyawadi campus banner" },
  { image: "/lps-vidhyawadi/gallery-01.jpg", title: "Gallery 1", description: "LPS Vidyawadi gallery image 1" },
  { image: "/lps-vidhyawadi/gallery-02.jpg", title: "Gallery 2", description: "LPS Vidyawadi gallery image 2" },
];

export async function GET() {
  try {
    await connectToDatabase();
    let carousel = await CarouselModel.findOne({ key: "homepage" }).lean();
    if (!carousel) {
      // Return default slides if not created in database yet
      return NextResponse.json({ key: "homepage", slides: defaultSlides });
    }
    return NextResponse.json(carousel);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch carousel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.slides || !Array.isArray(body.slides)) {
      return NextResponse.json({ error: "Slides array is required." }, { status: 400 });
    }

    const updated = await CarouselModel.findOneAndUpdate(
      { key: "homepage" },
      { slides: body.slides },
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update carousel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
