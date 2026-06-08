import { model, models, Schema, type InferSchemaType } from "mongoose";

const BrandSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g., "logo", "favicon"
    value: { type: String, required: true }, // URL or path
    alt: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export type BrandDocument = InferSchemaType<typeof BrandSchema> & { _id: string };

export const BrandModel = models.Brand || model("Brand", BrandSchema);
