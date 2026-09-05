import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultPage, listCmsPages, normalizePage } from "@/lib/cms-pages";
import { connectToDatabase } from "@/lib/mongodb";
import { PageModel } from "@/models/Page";
import { PageContentModel } from "@/models/PageContent";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const item = await PageContentModel.findOne({ slug }).lean();
      return NextResponse.json(item);
    }

    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const items = await listCmsPages();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch page content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const body = await request.json();
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const starter = defaultPage(slug);
    starter.title = String(body.title ?? starter.title).trim() || starter.title;
    const page = normalizePage(starter);

    const created = await PageModel.findOneAndUpdate(
      { slug },
      { slug: page.slug, title: page.title, sections: page.sections },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    if (!created) {
      return NextResponse.json({ error: "Failed to create page." }, { status: 500 });
    }

    return NextResponse.json(
      normalizePage({
        slug: created.slug,
        title: created.title,
        sections: (created.sections ?? []) as typeof page.sections,
      }),
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "ID or Slug is required." }, { status: 400 });
    }

    const query = body.id ? { _id: body.id } : { slug: body.slug };

    const updated = await PageContentModel.findOneAndUpdate(
      query,
      {
        title: body.title,
        subtitle: body.subtitle,
        group: body.group,
        heroImage: body.heroImage,
        sections: body.sections || [],
      },
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update page content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Page ID is required." }, { status: 400 });
    }

    const deleted = await PageContentModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Page not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete page content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
