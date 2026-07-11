import { model, models, Schema, type InferSchemaType } from "mongoose";

const MediaItemSchema = new Schema(
  {
    title: { type: String, required: true },
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    type: { type: String, enum: ["photo", "video", "highlight", "hostel-photo", "nss-photo", "ncc-photo"], required: true },
    category: { type: String, default: "Others", trim: true },
  },
  {
    timestamps: true,
  }
);

export type MediaItemDocument = InferSchemaType<typeof MediaItemSchema> & { _id: string };

export const MediaItemModel = models.MediaItem || model("MediaItem", MediaItemSchema);
