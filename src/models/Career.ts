import { model, models, Schema, type InferSchemaType } from "mongoose";

const JobOpeningSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    experience: { type: String, default: "", trim: true },
    qualification: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    requirements: { type: [String], default: [] },
    salary: { type: String, default: "As per school norms", trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const JobApplicationSchema = new Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    resume: { type: String, required: true, trim: true },
    message: { type: String, default: "", trim: true },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type JobOpeningDocument = InferSchemaType<typeof JobOpeningSchema> & { _id: string };
export type JobApplicationDocument = InferSchemaType<typeof JobApplicationSchema> & { _id: string };

export const JobOpeningModel = models.JobOpening || model("JobOpening", JobOpeningSchema);
export const JobApplicationModel = models.JobApplication || model("JobApplication", JobApplicationSchema);
