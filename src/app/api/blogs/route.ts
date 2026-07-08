import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogModel } from "@/models/Blog";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("admin") === "true";

    const query = includeDrafts ? {} : { status: "Published" };
    const items = await BlogModel.find(query).sort({ publishedAt: -1 }).lean();

    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch blogs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.slug || !body.excerpt || !body.content || !body.image) {
      return NextResponse.json({ error: "Title, Slug, Excerpt, Content, and Featured Image are required." }, { status: 400 });
    }

    const existing = await BlogModel.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 400 });
    }

    const created = await BlogModel.create({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      author: body.author || "Admin",
      tags: body.tags || [],
      publishedAt: body.publishedAt || new Date(),
      status: body.status || "Published",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create blog post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Blog ID is required." }, { status: 400 });
    }

    if (body.slug) {
      const existing = await BlogModel.findOne({ slug: body.slug, _id: { $ne: body.id } });
      if (existing) {
        return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 400 });
      }
    }

    const updated = await BlogModel.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        image: body.image,
        author: body.author,
        tags: body.tags || [],
        publishedAt: body.publishedAt,
        status: body.status,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update blog post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Blog ID is required." }, { status: 400 });
    }

    const deleted = await BlogModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete blog post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
