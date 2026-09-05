import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { CmsPage } from "@/lib/cms-types";

export default function CmsPageView({ page }: { page: CmsPage }) {
  return (
    <main className="min-h-screen bg-[#F8F9FC]">
      <Navbar />
      <div className="pt-24 lg:pt-32">
        <SectionRenderer sections={page.sections} />
      </div>
      <Footer />
    </main>
  );
}
