import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogModel } from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.lpsvidhyawadi.com";

  // Static school page routes
  const staticRoutes = [
    "",
    "/about-lps",
    "/about/management",
    "/about/management-message",
    "/about/ceo-message",
    "/principals-desk",
    "/managing-committee",
    "/investiture-ceremony",
    "/scholastic",
    "/co-scholastic",
    "/sports",
    "/school-planner",
    "/eligibility-criteria",
    "/fee-structure",
    "/fee-policy",
    "/apply-for-admission",
    "/downloads",
    "/download-tc",
    "/pre-primary",
    "/day-schooling",
    "/hostel",
    "/hostel-care",
    "/meals",
    "/a-day-at-school",
    "/items-required-by-boarders",
    "/photo-gallery",
    "/video-gallery",
    "/magazine",
    "/news",
    "/transport",
    "/public-disclosures-cbse",
    "/g-r-mechanism",
    "/holiday-list",
    "/announcements",
    "/blog",
    "/career",
    "/contact",
    "/result",
  ];

  const staticMaps = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Blog routes from Mongoose DB
  let blogMaps: any[] = [];
  try {
    await connectToDatabase();
    const blogs = await BlogModel.find({ status: "Published" }).select("slug updatedAt").lean();
    blogMaps = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap dynamic blogs generation failed:", err);
  }

  return [...staticMaps, ...blogMaps];
}
