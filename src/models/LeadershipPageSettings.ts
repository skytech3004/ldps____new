import { model, models, Schema, type InferSchemaType } from "mongoose";

const LeadershipPageSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "leadership" },
    introContent: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export type LeadershipPageSettingsDocument = InferSchemaType<typeof LeadershipPageSettingsSchema> & { _id: string };

export const LeadershipPageSettingsModel =
  models.LeadershipPageSettings || model("LeadershipPageSettings", LeadershipPageSettingsSchema);
