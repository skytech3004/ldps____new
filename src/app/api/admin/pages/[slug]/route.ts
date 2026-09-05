import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultPage, getCmsPage, normalizePage } from "@/lib/cms-pages";
import { connectToDatabase } from "@/lib/mongodb";
import type { CmsPage } from "@/lib/cms-types";
import { publicPathFor } from "@/lib/site-registry";
import { PageModel } from "@/models/Page";

function revalidatePublicPage(slug: string) {
  revalidatePath(publicPathFor(slug));
  revalidatePath(`/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/pages/${slug}`);
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slug } = await context.params;
  const page = await getCmsPage(slug);
  return NextResponse.json(page);
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as Partial<CmsPage>;
    const incoming = normalizePage({
      slug,
      title: body.title || defaultPage(slug).title,
      sections: body.sections ?? [],
    });

    await connectToDatabase();
    const updated = await PageModel.findOneAndUpdate(
      { slug },
      { slug: incoming.slug, title: incoming.title, sections: incoming.sections },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Failed to save page." }, { status: 500 });
    }

    revalidatePublicPage(slug);

    return NextResponse.json(
      normalizePage({
        slug: updated.slug,
        title: updated.title,
        sections: (updated.sections ?? []) as CmsPage["sections"],
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { slug } = await context.params;
    await connectToDatabase();
    await PageModel.findOneAndDelete({ slug });
    revalidatePublicPage(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete page.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
