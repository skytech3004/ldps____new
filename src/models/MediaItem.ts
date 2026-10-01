import { model, models, Schema, type InferSchemaType } from "mongoose";

const MediaItemSchema = new Schema(
  {
    title: { type: String, required: true },
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    type: { type: String, enum: ["photo", "video", "highlight", "event-photo", "hostel-photo", "guide-bulbul-photo", "ncc-photo", "ncc-featured", "guide-bulbul-featured"], required: true },
    category: { type: String, default: "Others", trim: true },
  },
  {
    timestamps: true,
  }
);

MediaItemSchema.index({ type: 1, createdAt: -1 });
MediaItemSchema.index({ category: 1, createdAt: -1 });

export type MediaItemDocument = InferSchemaType<typeof MediaItemSchema> & { _id: string };

export const MediaItemModel = models.MediaItem || model("MediaItem", MediaItemSchema);
