import { model, models, Schema, type InferSchemaType } from "mongoose";

const PageSectionSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageSchema = new Schema(
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
    sections: {
      type: [PageSectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export type PageDocument = InferSchemaType<typeof PageSchema> & { _id: string };

export const PageModel = models.CmsPage || model("CmsPage", PageSchema);
