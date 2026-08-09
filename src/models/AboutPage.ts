import { model, models, Schema, type InferSchemaType } from "mongoose";

const ManagementMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const AboutPageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pageTitle: { type: String, default: "", trim: true },
    bannerImage: { type: String, default: "", trim: true },
    portraitImage: { type: String, default: "", trim: true },
    personName: { type: String, default: "", trim: true },
    personDesignation: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    members: { type: [ManagementMemberSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export type AboutPageDocument = InferSchemaType<typeof AboutPageSchema> & { _id: string };

export const AboutPageModel = models.AboutPage || model("AboutPage", AboutPageSchema);
