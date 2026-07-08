import { model, models, Schema, type InferSchemaType } from "mongoose";

const HostelFacilitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    src: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HostelFeeSchema = new Schema(
  {
    classLevel: { type: String, required: true, trim: true },
    nonAcFee: { type: String, required: true, trim: true },
    acFee: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HostelRuleSchema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bullets: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type HostelFacilityDocument = InferSchemaType<typeof HostelFacilitySchema> & { _id: string };
export type HostelFeeDocument = InferSchemaType<typeof HostelFeeSchema> & { _id: string };
export type HostelRuleDocument = InferSchemaType<typeof HostelRuleSchema> & { _id: string };

export const HostelFacilityModel = models.HostelFacility || model("HostelFacility", HostelFacilitySchema);
export const HostelFeeModel = models.HostelFee || model("HostelFee", HostelFeeSchema);
export const HostelRuleModel = models.HostelRule || model("HostelRule", HostelRuleSchema);
