export const SECTION_TYPES = [
  "hero",
  "text-content",
  "card-grid",
  "stat-cards",
  "side-by-side",
  "cta-section",
  "video",
  "collection-embed",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type CmsSection = {
  id: string;
  type: string;
  isVisible: boolean;
  order: number;
  content: Record<string, unknown>;
};

export type CmsPage = {
  slug: string;
  title: string;
  sections: CmsSection[];
};

export type FieldType = "string" | "text" | "url" | "image" | "number" | "boolean" | "select" | "array" | "json" | "csv";

export type FieldSchema = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  itemLabel?: string;
  itemFields?: FieldSchema[];
};

export type UiKitEntry = {
  label: string;
  defaultContent: Record<string, unknown>;
  schema: FieldSchema[];
};
