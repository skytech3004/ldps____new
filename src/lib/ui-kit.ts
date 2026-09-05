import type { CmsSection, FieldSchema, UiKitEntry } from "@/lib/cms-types";

export const UI_KIT: Record<string, UiKitEntry> = {
  hero: {
    label: "Hero",
    defaultContent: {
      eyebrow: "LPS Vidyawadi",
      title: "Leeladevi Parasmal Sancheti School",
      subtitle: "A CBSE girls' residential school at Vidyawadi, Khimel.",
      image: "/lps-vidhyawadi/gallery-01.jpg",
      ctaLabel: "Apply for Admission",
      ctaHref: "/apply-for-admission",
    },
    schema: [
      { key: "eyebrow", label: "Eyebrow", type: "string", placeholder: "Short label above the title" },
      { key: "title", label: "Title", type: "string" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "image", label: "Background image", type: "image" },
      { key: "ctaLabel", label: "CTA label", type: "string" },
      { key: "ctaHref", label: "CTA link", type: "url" },
    ],
  },
  "text-content": {
    label: "Text content",
    defaultContent: {
      title: "About this page",
      body: "Add the page story, guidelines, or academic notes here.",
    },
    schema: [
      { key: "title", label: "Heading", type: "string" },
      { key: "body", label: "Body", type: "text" },
    ],
  },
  "card-grid": {
    label: "Card grid",
    defaultContent: {
      title: "Campus highlights",
      cards: [
        {
          title: "Smart classrooms",
          desc: "Digital boards and structured lesson plans across every class.",
          icon: "BookOpen",
          image: "/lps-vidhyawadi/gallery-02.jpg",
        },
        {
          title: "Safe hostels",
          desc: "Residential care with 24×7 supervision on campus.",
          icon: "Home",
          image: "/uploads/hostel/hostel.jpg",
        },
        {
          title: "Sports culture",
          desc: "Daily games, fitness, and competitive selections.",
          icon: "Trophy",
          image: "/lps-vidhyawadi/gallery-09.jpg",
        },
      ],
    },
    schema: [
      { key: "title", label: "Section title", type: "string" },
      {
        key: "cards",
        label: "Cards",
        type: "array",
        itemLabel: "Card",
        itemFields: [
          { key: "title", label: "Title", type: "string" },
          { key: "desc", label: "Description", type: "text" },
          { key: "icon", label: "Icon name", type: "string", placeholder: "BookOpen, Home, Trophy" },
          { key: "image", label: "Image", type: "image" },
        ],
      },
    ],
  },
  "stat-cards": {
    label: "Stat cards",
    defaultContent: {
      title: "At a glance",
      stats: [
        { label: "Years of legacy", value: "70+" },
        { label: "Acre campus", value: "65+" },
        { label: "Students", value: "1100+" },
        { label: "Hostel blocks", value: "8+" },
      ],
    },
    schema: [
      { key: "title", label: "Section title", type: "string" },
      {
        key: "stats",
        label: "Stats",
        type: "array",
        itemLabel: "Stat",
        itemFields: [
          { key: "label", label: "Label", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
      },
    ],
  },
  "side-by-side": {
    label: "Side by side",
    defaultContent: {
      title: "Life at Vidyawadi",
      body: "Girls live, learn, and grow on a 65-acre campus with classrooms, hostels, dining, and play fields in one secure environment.",
      image: "/lps-vidhyawadi/gallery-01.jpg",
      imagePosition: "left",
    },
    schema: [
      { key: "title", label: "Heading", type: "string" },
      { key: "body", label: "Body", type: "text" },
      { key: "image", label: "Image", type: "image" },
      {
        key: "imagePosition",
        label: "Image position",
        type: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
        ],
      },
    ],
  },
  "cta-section": {
    label: "Call to action",
    defaultContent: {
      title: "Visit the campus",
      subtitle: "Talk to admissions about day schooling, hostel life, and the current session.",
      buttonLabel: "Contact us",
      buttonHref: "/contact",
    },
    schema: [
      { key: "title", label: "Title", type: "string" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "buttonLabel", label: "Button label", type: "string" },
      { key: "buttonHref", label: "Button link", type: "url" },
    ],
  },
  video: {
    label: "Video",
    defaultContent: {
      title: "Campus film",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      caption: "A short look at school life at LPS Vidyawadi.",
    },
    schema: [
      { key: "title", label: "Title", type: "string" },
      { key: "url", label: "YouTube or video URL", type: "url" },
      { key: "caption", label: "Caption", type: "text" },
    ],
  },
  "collection-embed": {
    label: "Collection embed",
    defaultContent: {
      title: "Board results",
      collection: "board-results",
      year: "2024-25",
      limit: 12,
    },
    schema: [
      { key: "title", label: "Heading", type: "string" },
      {
        key: "collection",
        label: "Collection",
        type: "select",
        options: [
          { value: "board-results", label: "Board results" },
          { value: "faculty", label: "Faculty / leadership" },
          { value: "teachers", label: "Teachers roster" },
          { value: "notices", label: "Notices" },
          { value: "events", label: "Events" },
          { value: "contacts", label: "Contacts" },
        ],
      },
      { key: "year", label: "Year (results)", type: "string", placeholder: "2024-25" },
      { key: "limit", label: "Limit", type: "number" },
    ],
  },
};

export const CARD_ITEM_DEFAULT = {
  title: "New card",
  desc: "Describe this highlight.",
  icon: "Sparkles",
  image: "",
};

export const STAT_ITEM_DEFAULT = {
  label: "Label",
  value: "0",
};

export function getKitEntry(type: string): UiKitEntry {
  return UI_KIT[type] ?? UI_KIT["text-content"];
}

export function mergeSectionContent(type: string, content: unknown) {
  const defaults = getKitEntry(type).defaultContent;
  const incoming = content && typeof content === "object" && !Array.isArray(content) ? (content as Record<string, unknown>) : {};
  return { ...defaults, ...incoming };
}

export function createSection(type: string, order = 0): CmsSection {
  const kit = getKitEntry(type);
  return {
    id: crypto.randomUUID(),
    type: UI_KIT[type] ? type : "text-content",
    isVisible: true,
    order,
    content: structuredClone(kit.defaultContent),
  };
}

export function defaultArrayItem(fields: FieldSchema[] | undefined) {
  if (!fields) return {};
  const keys = fields.map((field) => field.key).join(",");
  if (keys.includes("desc") && keys.includes("icon")) return { ...CARD_ITEM_DEFAULT };
  if (keys.includes("label") && keys.includes("value")) return { ...STAT_ITEM_DEFAULT };
  const item: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "number") item[field.key] = 0;
    else if (field.type === "boolean") item[field.key] = false;
    else if (field.type === "array") item[field.key] = [];
    else item[field.key] = "";
  }
  return item;
}
