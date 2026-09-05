import { model, models, Schema, type InferSchemaType } from "mongoose";

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "" },
    content: { type: [String], default: [] },
    items: { type: Schema.Types.Mixed, default: [] },
  },
  { _id: false }
);

const PageContentSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    group: {
      type: String,
      default: "General",
      trim: true,
    },
    heroImage: {
      type: String,
      default: "",
      trim: true,
    },
    sections: {
      type: [SectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type PageContentDocument = InferSchemaType<typeof PageContentSchema> & { _id: string };

export const PageContentModel = models.PageContent || model("PageContent", PageContentSchema);

