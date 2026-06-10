import { model, models, Schema, type InferSchemaType } from "mongoose";

const DisclosureDocumentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type DisclosureDocumentDocument = InferSchemaType<typeof DisclosureDocumentSchema> & { _id: string };

export const DisclosureDocumentModel = models.DisclosureDocument || model("DisclosureDocument", DisclosureDocumentSchema);
