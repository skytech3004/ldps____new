import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogModel } from "@/models/Blog";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const item = await BlogModel.findOne({ slug }).lean();

    if (!item) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch blog post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
