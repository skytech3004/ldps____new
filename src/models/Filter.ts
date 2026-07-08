import { model, models, Schema, type InferSchemaType } from "mongoose";

const FilterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["gallery", "blog", "hostel"], required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate filter tags for the same category/type
FilterSchema.index({ name: 1, type: 1 }, { unique: true });

export type FilterDocument = InferSchemaType<typeof FilterSchema> & { _id: string };

export const FilterModel = models.Filter || model("Filter", FilterSchema);
