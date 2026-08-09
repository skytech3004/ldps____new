import { model, models, Schema, type InferSchemaType } from "mongoose";

const ImportantContactSchema = new Schema(
  {
    department: { type: String, required: true, trim: true },
    contactName: { type: String, default: "", trim: true },
    designation: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ImportantContactDocument = InferSchemaType<typeof ImportantContactSchema> & { _id: string };

export const ImportantContactModel =
  models.ImportantContact || model("ImportantContact", ImportantContactSchema);
