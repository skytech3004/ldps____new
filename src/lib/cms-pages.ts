import { gisMenuItems } from "@/data/gisMenu";
import { connectToDatabase } from "@/lib/mongodb";
import { createSection, UI_KIT } from "@/lib/ui-kit";
import type { CmsPage, CmsSection } from "@/lib/cms-types";
import { PageModel } from "@/models/Page";
import { PageContentModel } from "@/models/PageContent";

function titleFromSlug(slug: string) {
  const menu = gisMenuItems.find((item) => item.slug === slug);
  if (menu) return menu.title;
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function defaultPage(slug: string): CmsPage {
  if (slug === "about-lps") {
    return aboutLpsDefaultPage(slug);
  }

  const title = titleFromSlug(slug);
  const sections: CmsSection[] = [
    createSection("hero", 0),
    createSection("text-content", 1),
    createSection("stat-cards", 2),
    createSection("card-grid", 3),
    createSection("cta-section", 4),
  ];
  const hero = sections[0];
  hero.content = {
    ...UI_KIT.hero.defaultContent,
    title,
    subtitle: `Detailed information for ${title} at Leeladevi Parasmal Sancheti School, Vidyawadi.`,
  };
  return {
    slug,
    title,
    sections,
  };
}

function aboutLpsDefaultPage(slug: string): CmsPage {
  const title = "About LPS";
  const sections: CmsSection[] = [
    createSection("hero", 0),
    createSection("text-content", 1),
    createSection("stat-cards", 2),
    createSection("card-grid", 3),
    createSection("side-by-side", 4),
    createSection("text-content", 5),
    createSection("card-grid", 6),
    createSection("side-by-side", 7),
    createSection("cta-section", 8),
  ];

  sections[0].content = {
    ...UI_KIT.hero.defaultContent,
    eyebrow: "Best CBSE Girls' Boarding School in Rajasthan",
    title: "Leeladevi Parasmal Sancheti School",
    subtitle: "Empowering Girls with Quality Education, Strong Values & Future-Ready Skills",
    image: "/lps-vidhyawadi/image.jpeg",
    ctaLabel: "Apply For Admission",
    ctaHref: "/apply-for-admission",
  };

  sections[1].content = {
    title: "Foundation of LPS Vidyawadi",
    body:
      "About 67 years ago in 1956, a few visionary minds realized the critical importance of girls' education in Rajasthan and took the courageous initiative to make Vidyawadi a reality. Managed by the eminent Marudhar Mahila Shikshan Sangh, our institution has steadily consolidated democratic management, robust administration, and exceptional infrastructural advancements. We dedicate every resource to ensuring our girls receive a healthy, values-driven environment to flourish.",
  };

  sections[2].content = {
    title: "Why Parents Choose Us",
    stats: [
      { label: "Acre Campus", value: "65" },
      { label: "Comfortable Hostels", value: "7" },
      { label: "Academic Staff", value: "80+" },
      { label: "CBSE Affiliation", value: "CBSE" },
    ],
  };

  sections[3].content = {
    title: "Academic Excellence with Holistic Development",
    cards: [
      {
        title: "Concept-Based Learning",
        desc: "Shifting away from rote memorization to build a deep understanding of core concepts.",
        icon: "BookOpen",
        image: "/lps-vidhyawadi/gallery-01.jpg",
      },
      {
        title: "Critical Thinking",
        desc: "Developing problem-solving, analytical reasoning, and independent decision making.",
        icon: "Sparkles",
        image: "/lps-vidhyawadi/gallery-02.jpg",
      },
      {
        title: "Creativity & Innovation",
        desc: "Encouraging fresh perspectives, originality, and hands-on experiments.",
        icon: "Sparkles",
        image: "/lps-vidhyawadi/gallery-03.jpg",
      },
    ],
  };

  sections[4].content = {
    title: "A Home Away From Home",
    body:
      "Parents trust us because we provide a nurturing residential environment where students feel safe, happy, motivated, and fully cared for. Every child enjoys an atmosphere that feels truly like a second home.",
    image: "/lps-vidhyawadi/about.jpeg",
    imagePosition: "right",
  };

  sections[5].content = {
    title: "Vision, Mission & Values",
    body:
      "Our vision is to become one of India's most respected girls' educational institutions by nurturing confident, ethical, innovative, and socially responsible young women. Our mission is to provide a healthy, inclusive, and inspiring learning environment where every girl receives quality education, develops strong values, and gains the confidence to lead a meaningful life.",
  };

  sections[6].content = {
    title: "Beyond Academics",
    cards: [
      {
        title: "Sports & Athletics",
        desc: "Fitness, team spirit, and healthy competition.",
        icon: "Trophy",
        image: "/lps-vidhyawadi/gallery-09.jpg",
      },
      {
        title: "Yoga & Meditation",
        desc: "Balance, focus, and emotional well-being.",
        icon: "Sparkles",
        image: "/lps-vidhyawadi/gallery-10.jpg",
      },
      {
        title: "Music & Dance",
        desc: "Creativity and confident self-expression.",
        icon: "Sparkles",
        image: "/lps-vidhyawadi/gallery-11.jpg",
      },
    ],
  };

  sections[7].content = {
    title: "Vidyawadi Campus Showcase",
    body: "Explore snapshots of the lively residential environment, support facilities, and activities.",
    image: "/lps-vidhyawadi/gallery-09.jpg",
    imagePosition: "left",
  };

  sections[8].content = {
    title: "Building Tomorrow's Women Leaders",
    subtitle:
      "With academic excellence, modern infrastructure, experienced educators, strong moral values, and a secure residential campus, Leeladevi Parasmal Sancheti English Medium Sr. Sec. School continues to shape generations of young women ready to succeed in an ever-changing world.",
    buttonLabel: "Begin Admission Query",
    buttonHref: "/apply-for-admission",
  };

  return {
    slug,
    title,
    sections,
  };
}

export function normalizePage(page: CmsPage): CmsPage {
  const sections = [...(page.sections ?? [])]
    .map((section, index) => ({
      id: section.id || crypto.randomUUID(),
      type: section.type || "text-content",
      isVisible: section.isVisible !== false,
      order: typeof section.order === "number" ? section.order : index,
      content: section.content && typeof section.content === "object" ? section.content : {},
    }))
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: index }));

  return {
    slug: page.slug,
    title: page.title || titleFromSlug(page.slug),
    sections,
  };
}

export async function getCmsPage(slug: string): Promise<CmsPage> {
  try {
    await connectToDatabase();
    const doc = await PageModel.findOne({ slug }).lean();
    if (doc) {
      return normalizePage({
        slug: doc.slug,
        title: doc.title,
        sections: (doc.sections ?? []) as CmsSection[],
      });
    }

    const pageContent = await PageContentModel.findOne({ slug }).lean();
    if (pageContent) {
      const heroSection = createSection("hero", 0);
      heroSection.content = {
        ...UI_KIT.hero.defaultContent,
        title: pageContent.title,
        subtitle: pageContent.subtitle || `Detailed information for ${pageContent.title} at LPS Vidyawadi.`,
      };

      const textSection = createSection("text-content", 1);
      const formattedBody = (pageContent.sections || [])
        .map(
          (s: { title: string; subtitle?: string; content?: string[] }) =>
            `<h3>${s.title}</h3>` +
            (s.subtitle ? `<p><em>${s.subtitle}</em></p>` : "") +
            (Array.isArray(s.content) ? s.content.map((c: string) => `<p>${c}</p>`).join("") : "")
        )
        .join("<br/>");

      textSection.content = {
        heading: pageContent.title,
        body: formattedBody || pageContent.subtitle || "",
      };

      return normalizePage({
        slug,
        title: pageContent.title,
        sections: [heroSection, textSection],
      });
    }

    return defaultPage(slug);
  } catch {
    return defaultPage(slug);
  }
}

export async function listCmsPages() {
  try {
    await connectToDatabase();
    const docs = await PageModel.find().select("slug title updatedAt").sort({ title: 1 }).lean();
    return docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      updatedAt: "updatedAt" in doc ? doc.updatedAt : null,
    }));
  } catch {
    return [];
  }
}
