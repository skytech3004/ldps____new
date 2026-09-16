import { model, models, Schema, type InferSchemaType } from "mongoose";

const TrustMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TrustMemberDocument = InferSchemaType<typeof TrustMemberSchema> & { _id: string };
export const TrustMemberModel = models.TrustMember || model("TrustMember", TrustMemberSchema);
