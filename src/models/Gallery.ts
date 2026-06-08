import { model, models, Schema, type InferSchemaType } from "mongoose";

const GallerySchema = new Schema(
  {
    title: { type: String, required: true },
    page: { type: String, default: "home" },
    category: { type: String, default: "Campus" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
    photos: { type: [String], default: [] },
    cover: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export type GalleryDocument = InferSchemaType<typeof GallerySchema> & { _id: string };

export const GalleryModel = models.Gallery || model("Gallery", GallerySchema);
