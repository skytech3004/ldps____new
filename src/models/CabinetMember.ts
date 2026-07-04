import { model, models, Schema, type InferSchemaType } from "mongoose";

const CabinetMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type CabinetMemberDocument = InferSchemaType<typeof CabinetMemberSchema> & { _id: string };

export const CabinetMemberModel = models.CabinetMember || model("CabinetMember", CabinetMemberSchema);
