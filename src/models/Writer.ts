import { model, models, Schema, type InferSchemaType } from "mongoose";

const WriterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    designation: { type: String, default: "Author", trim: true },
    bio: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export type WriterDocument = InferSchemaType<typeof WriterSchema> & { _id: string };
export const WriterModel = models.Writer || model("Writer", WriterSchema);
