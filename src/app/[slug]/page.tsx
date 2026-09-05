import CmsPageView from "@/components/CmsPageView";
import { getCmsPage } from "@/lib/cms-pages";
import { gisMenuItems } from "@/data/gisMenu";
import { connectToDatabase } from "@/lib/mongodb";
import { PageModel } from "@/models/Page";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const RESERVED = new Set(["admin", "api", "uploads"]);

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  return { title: page.title };
}

export default async function CmsPublicPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  let saved = false;
  try {
    await connectToDatabase();
    saved = Boolean(await PageModel.findOne({ slug }).select("_id").lean());
  } catch {
    saved = false;
  }

  const known = gisMenuItems.some((item) => item.slug === slug);
  if (!saved && !known) notFound();

  const page = await getCmsPage(slug);
  return <CmsPageView page={page} />;
}
