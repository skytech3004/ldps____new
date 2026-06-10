import { model, models, Schema, type InferSchemaType } from "mongoose";

const LeadershipMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type LeadershipMemberDocument = InferSchemaType<typeof LeadershipMemberSchema> & { _id: string };

export const LeadershipMemberModel = models.LeadershipMember || model("LeadershipMember", LeadershipMemberSchema);
