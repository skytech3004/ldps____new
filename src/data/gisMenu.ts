export type GisMenuItem = {
  title: string;
  slug: string;
  group: "About" | "Academics" | "Schooling" | "Gallery" | "More" | "Top";
  sourceUrl?: string;
  external?: boolean;
};

export const gisMenuItems: GisMenuItem[] = [
  { title: "Home", slug: "home", group: "Top", sourceUrl: "https://www.gangainternationalschool.com/" },
  { title: "About LPS", slug: "about-lps", group: "About", sourceUrl: "https://www.gangainternationalschool.com/about-gis/" },
  { title: "Leadership Team", slug: "leadership", group: "About", sourceUrl: "https://www.gangainternationalschool.com/" },
  { title: "Principal’s Desk", slug: "principals-desk", group: "About", sourceUrl: "https://www.gangainternationalschool.com/principals-desk/" },
  { title: "Managing Committee", slug: "managing-committee", group: "About", sourceUrl: "https://www.gangainternationalschool.com/managing-committee/" },
  { title: "Scholastic", slug: "scholastic", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/scholastic/" },
  { title: "Co-Scholastic", slug: "co-scholastic", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/co-scholastic/" },
  { title: "Sports", slug: "sports", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/sports/" },
  { title: "Result 2024-25", slug: "result-2024-25", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/result-2024-25/" },
  { title: "Result 2023-24", slug: "result-2023-24", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/result-2023-24/" },
  { title: "School Planner", slug: "school-planner", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/school-planner/" },
  { title: "E-Brochure", slug: "e-brochure", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/e-brochure/" },
  { title: "Eligibility Criteria", slug: "eligibility-criteria", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/eligibility-criteria/" },
  { title: "Fee Structure", slug: "fee-structure", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/fee-structure/" },
  { title: "Fee Policy", slug: "fee-policy", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/fee-policy/" },
  { title: "Apply For Admission", slug: "apply-for-admission", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/apply-for-admission/" },
  { title: "Downloads", slug: "downloads", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/downloads/" },
  { title: "Download TC", slug: "download-tc", group: "Academics", sourceUrl: "https://www.gangainternationalschool.com/download-tc/" },
  { title: "Pre-Primary", slug: "pre-primary", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/pre-primary/" },
  { title: "Day Schooling", slug: "day-schooling", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/day-schooling/" },
  { title: "Hostel", slug: "hostel", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/hostel/" },
  { title: "Hostel Care", slug: "hostel-care", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/pastoral-care/" },
  { title: "Meals", slug: "meals", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/meals/" },
  { title: "A Day at School", slug: "a-day-at-school", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/a-day-at-gis/" },
  { title: "Items Required By Boarders", slug: "items-required-by-boarders", group: "Schooling", sourceUrl: "https://www.gangainternationalschool.com/wp-content/uploads/2025/12/Items-required-by-boarders-1.pdf" },
  { title: "Photo Gallery", slug: "photo-gallery", group: "Gallery", sourceUrl: "https://www.gangainternationalschool.com/photo-gallery/" },
  { title: "Video Gallery", slug: "video-gallery", group: "Gallery", sourceUrl: "https://www.gangainternationalschool.com/video-gallery/" },
  { title: "Magazine", slug: "magazine", group: "More", sourceUrl: "https://www.gangainternationalschool.com/magazine/" },
  { title: "News", slug: "news", group: "More", sourceUrl: "https://www.gangainternationalschool.com/news/" },
  { title: "Transport", slug: "transport", group: "More", sourceUrl: "https://www.gangainternationalschool.com/transport/" },
  { title: "Public Disclosures- CBSE", slug: "public-disclosures-cbse", group: "More", sourceUrl: "https://www.gangainternationalschool.com/mandatory-public-disclosures-cbse/" },
  { title: "G. R. Mechanism", slug: "g-r-mechanism", group: "More", sourceUrl: "https://www.gangainternationalschool.com/g-r-mechanism/" },
  { title: "Holiday List", slug: "holiday-list", group: "More", sourceUrl: "https://www.gangainternationalschool.com/holiday-list/" },
  { title: "Announcements", slug: "announcements", group: "More", sourceUrl: "https://www.gangainternationalschool.com/announcements/" },
  { title: "More Home", slug: "more", group: "More", sourceUrl: "https://www.gangainternationalschool.com/" },
  { title: "Blog", slug: "blog", group: "Top", sourceUrl: "https://www.gangainternationalschool.com/blog/" },
  { title: "Contact", slug: "contact", group: "Top", sourceUrl: "https://www.gangainternationalschool.com/contact/" },
];
