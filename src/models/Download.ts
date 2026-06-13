import { model, models, Schema, type InferSchemaType } from "mongoose";

const DownloadSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    filename: { type: String, required: true, trim: true },
    fileSize: { type: String, trim: true, default: "" },
    pdfUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type DownloadDocument = InferSchemaType<typeof DownloadSchema> & { _id: string };

export const DownloadModel = models.Download || model("Download", DownloadSchema);
