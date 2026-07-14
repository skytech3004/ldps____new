import { model, models, Schema, type InferSchemaType } from "mongoose";

const DisclosureDocumentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    pdfUrl: { type: String, trim: true },
    category: { type: String, default: "documents", trim: true },
    value: { type: String, trim: true },
    details: { type: String, trim: true },
    count: { type: Number },
  },
  { timestamps: true }
);

export type DisclosureDocumentDocument = InferSchemaType<typeof DisclosureDocumentSchema> & { _id: string };

export const DisclosureDocumentModel = models.DisclosureDocument || model("DisclosureDocument", DisclosureDocumentSchema);
