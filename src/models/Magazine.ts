import { model, models, Schema, type InferSchemaType } from "mongoose";

const MagazineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type MagazineDocument = InferSchemaType<typeof MagazineSchema> & { _id: string };

export const MagazineModel = models.Magazine || model("Magazine", MagazineSchema);
