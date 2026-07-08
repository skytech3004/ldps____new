import { model, models, Schema, type InferSchemaType } from "mongoose";

const PrePrimaryItemSchema = new Schema(
  {
    section: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    src: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type PrePrimaryItemDocument = InferSchemaType<typeof PrePrimaryItemSchema> & { _id: string };
export const PrePrimaryItemModel = models.PrePrimaryItem || model("PrePrimaryItem", PrePrimaryItemSchema);
