import PageBuilderEditor from "@/components/admin/PageBuilderEditor";

export default async function AdminPageBuilder({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PageBuilderEditor slug={slug} />;
}
