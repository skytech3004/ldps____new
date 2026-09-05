import { COLLECTIONS } from "@/lib/collections-kit";

export type SitePageDef = {
  slug: string;
  title: string;
  path: string;
  group: string;
  collections: string[];
};

export const SITE_PAGES: SitePageDef[] = [
  { slug: "home", title: "Home", path: "/", group: "Site", collections: ["notices", "events", "carousel-hero", "carousel-home", "categories", "brand"] },
  { slug: "about-lps", title: "About LPS", path: "/about-lps", group: "About", collections: ["page-contents", "categories"] },
  { slug: "about-trust", title: "About Trust", path: "/about-trust", group: "About", collections: ["page-contents", "about-pages"] },
  { slug: "management", title: "Management Committee", path: "/about/management", group: "About", collections: ["about-pages", "leadership"] },
  { slug: "management-message", title: "President's Message", path: "/about/management-message", group: "About", collections: ["about-pages"] },
  { slug: "secretary-message", title: "Secretary's Message", path: "/about/secretary-message", group: "About", collections: ["about-pages"] },
  { slug: "ceo-message", title: "CEO's Message", path: "/about/ceo-message", group: "About", collections: ["about-pages"] },
  { slug: "principals-desk", title: "Principal's Desk", path: "/principals-desk", group: "About", collections: ["about-pages"] },
  { slug: "managing-committee", title: "Academic Excellence Team", path: "/managing-committee", group: "About", collections: ["teachers"] },
  { slug: "scholastic", title: "Scholastic", path: "/scholastic", group: "Academics", collections: ["page-contents"] },
  { slug: "co-scholastic", title: "Co-Scholastic", path: "/co-scholastic", group: "Academics", collections: ["page-contents"] },
  { slug: "sports", title: "Sports", path: "/sports", group: "Academics", collections: ["sports"] },
  { slug: "nss", title: "NSS", path: "/academics/nss", group: "Academics", collections: ["videos"] },
  { slug: "ncc", title: "NCC", path: "/academics/ncc", group: "Academics", collections: ["videos"] },
  { slug: "result-2024-25", title: "Result 2024-25", path: "/result/2024-25", group: "Academics", collections: ["results"] },
  { slug: "result-2023-24", title: "Result 2023-24", path: "/result/2023-24", group: "Academics", collections: ["results"] },
  { slug: "school-planner", title: "School Planner", path: "/school-planner", group: "Academics", collections: ["downloads"] },
  { slug: "eligibility-criteria", title: "Admission Guideline", path: "/eligibility-criteria", group: "Academics", collections: ["page-contents"] },
  { slug: "fee-structure", title: "Fee Structure", path: "/fee-structure", group: "Academics", collections: ["page-contents"] },
  { slug: "fee-policy", title: "Fee Policy", path: "/fee-policy", group: "Academics", collections: ["page-contents"] },
  { slug: "apply-for-admission", title: "Apply For Admission", path: "/apply-for-admission", group: "Academics", collections: ["inquiries"] },
  { slug: "downloads", title: "Downloads", path: "/downloads", group: "Academics", collections: ["downloads"] },
  { slug: "download-tc", title: "Download TC", path: "/download-tc", group: "Academics", collections: ["downloads"] },
  { slug: "pre-primary", title: "Pre-Primary", path: "/pre-primary", group: "Schooling", collections: ["page-contents", "pre-primary"] },
  { slug: "day-schooling", title: "Day Schooling", path: "/day-schooling", group: "Schooling", collections: ["page-contents"] },
  { slug: "hostel", title: "Hostel", path: "/hostel", group: "Schooling", collections: ["hostel-facilities", "hostel-fees", "hostel-rules"] },
  { slug: "hostel-care", title: "Hostel Care", path: "/hostel-care", group: "Schooling", collections: ["page-contents"] },
  { slug: "meals", title: "Meals", path: "/meals", group: "Schooling", collections: ["page-contents"] },
  { slug: "a-day-at-school", title: "A Day at School", path: "/a-day-at-school", group: "Schooling", collections: ["page-contents"] },
  { slug: "items-required-by-boarders", title: "Items Required By Boarders", path: "/items-required-by-boarders", group: "Schooling", collections: ["page-contents"] },
  { slug: "investiture-ceremony", title: "Investiture Ceremony", path: "/investiture-ceremony", group: "Schooling", collections: ["cabinet"] },
  { slug: "photo-gallery", title: "Photo Gallery", path: "/photo-gallery", group: "Gallery", collections: ["galleries", "videos"] },
  { slug: "video-gallery", title: "Video Gallery", path: "/video-gallery", group: "Gallery", collections: ["videos"] },
  { slug: "cbse-mandatory-disclosure", title: "CBSE Mandatory Disclosure", path: "/cbse-mandatory-disclosure", group: "CBSE", collections: ["disclosures"] },
  { slug: "magazine", title: "Magazine", path: "/magazine", group: "More", collections: ["magazines"] },
  { slug: "news", title: "News", path: "/news", group: "More", collections: ["notices"] },
  { slug: "transport", title: "Transport", path: "/transport", group: "More", collections: ["transport"] },
  { slug: "public-disclosures-cbse", title: "Public Disclosures", path: "/public-disclosures-cbse", group: "More", collections: ["disclosures"] },
  { slug: "g-r-mechanism", title: "G.R. Mechanism", path: "/g-r-mechanism", group: "More", collections: ["page-contents"] },
  { slug: "holiday-list", title: "Holiday List", path: "/holiday-list", group: "More", collections: ["holidays"] },
  { slug: "announcements", title: "Announcements", path: "/announcements", group: "More", collections: ["notices"] },
  { slug: "alumni", title: "Alumni Registration", path: "/alumni", group: "More", collections: ["alumni"] },
  { slug: "blog", title: "Blog", path: "/blog", group: "Site", collections: ["blogs"] },
  { slug: "career", title: "Careers", path: "/career", group: "Site", collections: ["careers"] },
  { slug: "contact", title: "Contact", path: "/contact", group: "Site", collections: ["contacts"] },
];

export function getSitePage(slug: string) {
  return SITE_PAGES.find((page) => page.slug === slug);
}

export function publicPathFor(slug: string) {
  return getSitePage(slug)?.path ?? (slug === "home" ? "/" : `/${slug}`);
}

export function collectionsForPage(slug: string) {
  const keys = getSitePage(slug)?.collections ?? [];
  return keys.map((key) => COLLECTIONS[key]).filter(Boolean);
}
