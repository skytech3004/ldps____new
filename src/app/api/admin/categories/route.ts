import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CategoryModel } from "@/models/Category";

const defaultCategories = [
  { title: "BOARDING", image: "/lps-vidhyawadi/gallery-01.jpg", link: "#" },
  { title: "SMART CLASSES", image: "/lps-vidhyawadi/gallery-02.jpg", link: "#" },
  { title: "SCIENCE LABS", image: "/lps-vidhyawadi/gallery-03.jpg", link: "#" },
  { title: "LIBRARY", image: "/lps-vidhyawadi/gallery-04.jpg", link: "#" },
  { title: "CULTURAL ACTIVITIES", image: "/lps-vidhyawadi/gallery-05.jpg", link: "#" },
  { title: "GAMES & SPORTS", image: "/lps-vidhyawadi/gallery-06.jpg", link: "#" },
  { title: "HOSTEL LIFE", image: "/lps-vidhyawadi/gallery-07.jpg", link: "#" },
  { title: "ACHIEVEMENTS", image: "/lps-vidhyawadi/gallery-08.jpg", link: "#" },
  { title: "CAMPUS", image: "/lps-vidhyawadi/gallery-09.jpg", link: "#" },
];

export async function GET() {
  try {
    await connectToDatabase();
    let categories = await CategoryModel.findOne({ key: "homepage" }).lean();
    if (!categories) {
      return NextResponse.json({ key: "homepage", items: defaultCategories });
    }
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Items array is required." }, { status: 400 });
    }

    const updated = await CategoryModel.findOneAndUpdate(
      { key: "homepage" },
      { items: body.items },
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update categories.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
