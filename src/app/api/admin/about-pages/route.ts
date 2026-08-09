import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AboutPageModel } from "@/models/AboutPage";
import { aboutPageDefaults, type AboutPageSlug } from "@/data/aboutPages";

const VALID_SLUGS = Object.keys(aboutPageDefaults) as AboutPageSlug[];

async function seedAboutPages() {
  for (const slug of VALID_SLUGS) {
    const existing = await AboutPageModel.findOne({ slug }).lean();
    if (!existing) {
      await AboutPageModel.create(aboutPageDefaults[slug]);
      continue;
    }

    if (slug === "management" && (!existing.members || existing.members.length === 0)) {
      await AboutPageModel.updateOne({ slug }, { $set: { members: aboutPageDefaults.management.members } });
    }
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await seedAboutPages();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") as AboutPageSlug | null;

    if (slug) {
      if (!VALID_SLUGS.includes(slug)) {
        return NextResponse.json({ error: "Invalid page slug." }, { status: 400 });
      }

      const page = await AboutPageModel.findOne({ slug }).lean();
      return NextResponse.json(page);
    }

    const pages = await AboutPageModel.find({ slug: { $in: VALID_SLUGS } }).sort({ slug: 1 }).lean();
    return NextResponse.json(pages);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch about pages.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const slug = body.slug as AboutPageSlug;

    if (!slug || !VALID_SLUGS.includes(slug)) {
      return NextResponse.json({ error: "Valid page slug is required." }, { status: 400 });
    }

    const updated = await AboutPageModel.findOneAndUpdate(
      { slug },
      {
        slug,
        pageTitle: String(body.pageTitle ?? ""),
        pageSubtitle: String(body.pageSubtitle ?? ""),
        bannerImage: String(body.bannerImage ?? ""),
        portraitImage: String(body.portraitImage ?? ""),
        personName: String(body.personName ?? ""),
        personDesignation: String(body.personDesignation ?? ""),
        content: String(body.content ?? ""),
        inspirationContent: String(body.inspirationContent ?? ""),
        members: Array.isArray(body.members)
          ? body.members.map((member: { name?: string; designation?: string; sortOrder?: number }, index: number) => ({
              name: String(member.name ?? "").trim(),
              designation: String(member.designation ?? "").trim(),
              sortOrder: Number.isFinite(Number(member.sortOrder)) ? Number(member.sortOrder) : index,
            }))
          : [],
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update about page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
