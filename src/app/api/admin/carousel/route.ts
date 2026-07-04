import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CarouselModel } from "@/models/Carousel";

const defaultSlides = [
  { image: "/lps-vidhyawadi/about-banner.jpg", title: "Campus Banner", description: "LPS Vidyawadi campus banner" },
  { image: "/lps-vidhyawadi/gallery-01.jpg", title: "Gallery 1", description: "LPS Vidyawadi gallery image 1" },
  { image: "/lps-vidhyawadi/gallery-02.jpg", title: "Gallery 2", description: "LPS Vidyawadi gallery image 2" },
];

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || "homepage";

    let carousel = await CarouselModel.findOne({ key }).lean();
    if (!carousel) {
      if (key === "hero") {
        const defaultHeroSlides = [
          {
            image: "/lps-vidhyawadi/about-banner.jpg",
            subtitle: "Premier Girls' Residential Institution",
            title: "QUALITY",
            highlight: "EDUCATION.",
            description: "Providing healthy learning environment and quality education at Vidyawadi, Khimel.",
          },
          {
            image: "/lps-vidhyawadi/gallery-01.jpg",
            subtitle: "Academic Excellence",
            title: "NURTURING",
            highlight: "POTENTIAL.",
            description: "CBSE education from L.K.G. to XII in a caring atmosphere built for confidence, leadership, and wellness.",
          },
          {
            image: "/lps-vidhyawadi/gallery-02.jpg",
            subtitle: "65 Acre Campus",
            title: "HOME",
            highlight: "AWAY FROM HOME.",
            description: "Hostels, labs, library, sports grounds, dining, transport, and support systems for holistic student life.",
          },
        ];
        return NextResponse.json({ key: "hero", slides: defaultHeroSlides });
      }
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

    const key = body.key || "homepage";

    const updateFields: any = {};
    if (body.slides && Array.isArray(body.slides)) {
      updateFields.slides = body.slides;
    }
    if (body.transition) {
      updateFields.transition = body.transition;
    }

    const updated = await CarouselModel.findOneAndUpdate(
      { key },
      updateFields,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update carousel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
