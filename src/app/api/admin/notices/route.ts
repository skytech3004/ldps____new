import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { NoticeModel } from "@/models/Notice";
import { allNotices } from "@/data/noticeData";

const NEWS_AND_CIRCULARS = "News & Circulars";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function expiryDate(date: Date) {
  return new Date(date.getTime() + ONE_WEEK_MS);
}

function slugifyTitle(title: string, category: string): string {
  const cleanCategory = category ? category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "";
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${cleanCategory}-${cleanTitle}`.slice(0, 90);
}

async function removeExpiredNewsAndCirculars() {
  await NoticeModel.deleteMany({
    category: NEWS_AND_CIRCULARS,
    expiresAt: { $exists: true, $lte: new Date() },
  });
}

async function seedNotices() {
  const count = await NoticeModel.estimatedDocumentCount();
  if (count === 0 && allNotices.length > 0) {
    const seedData = allNotices.map((n) => ({
      title: n.item,
      slug: n.slug || slugifyTitle(n.item, n.category),
      subject: n.subject,
      body: n.body,
      refNo: n.refNo,
      signatory: n.signatory,
      category: n.category,
      date: new Date(),
      isNew: true,
      link: "",
    }));
    await NoticeModel.insertMany(seedData);
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await seedNotices();
    await removeExpiredNewsAndCirculars();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id) {
      const item = await NoticeModel.findById(id).lean();
      return NextResponse.json(item);
    }

    if (slug) {
      let item = await NoticeModel.findOne({ slug }).lean();
      if (!item) {
        // Fallback search by computed slug matching
        const items = await NoticeModel.find().lean();
        item = items.find((n) => {
          const gen = slugifyTitle(n.title, n.category);
          const simple = n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
          return gen === slug || simple === slug || n.slug === slug;
        });
      }
      return NextResponse.json(item);
    }

    const items = await NoticeModel.find().sort({ date: -1, createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch notices.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Notice title is required." }, { status: 400 });
    }

    const date = body.date ? new Date(body.date) : new Date();
    const category = body.category || "News & Circulars";
    const slug = body.slug || slugifyTitle(body.title, category);

    const created = await NoticeModel.create({
      title: body.title,
      slug,
      subject: body.subject ?? "",
      body: body.body ?? "",
      refNo: body.refNo ?? "",
      signatory: body.signatory ?? "Dr. Preeti Sharma\nPrincipal, LPS Vidyawadi",
      category,
      date,
      isNew: body.isNew ?? true,
      link: body.link ?? "",
      expiresAt: category === NEWS_AND_CIRCULARS && body.enableExpiry ? expiryDate(date) : undefined,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create notice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Notice ID is required." }, { status: 400 });
    }

    const date = body.date ? new Date(body.date) : new Date();
    const category = body.category || "News & Circulars";
    const slug = body.slug || slugifyTitle(body.title, category);

    const update: Record<string, any> = {
      title: body.title,
      slug,
      subject: body.subject ?? "",
      body: body.body ?? "",
      refNo: body.refNo ?? "",
      signatory: body.signatory ?? "Dr. Preeti Sharma\nPrincipal, LPS Vidyawadi",
      category,
      date,
      isNew: body.isNew ?? true,
      link: body.link ?? "",
    };

    if (category === NEWS_AND_CIRCULARS && body.enableExpiry) {
      update.expiresAt = expiryDate(date);
    } else {
      update.$unset = { expiresAt: 1 };
    }

    const updated = await NoticeModel.findByIdAndUpdate(body.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Notice not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update notice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Notice ID is required." }, { status: 400 });
    }

    const deleted = await NoticeModel.findByIdAndDelete(body.id);

    if (!deleted) {
      return NextResponse.json({ error: "Notice not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete notice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
