import { model, models, Schema, type InferSchemaType } from "mongoose";

const SchoolFeeSchema = new Schema(
  {
    classLevel: { type: String, required: true, trim: true },
    annualFee: { type: String, required: true, trim: true },
    installment: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SchoolFeeDocument = InferSchemaType<typeof SchoolFeeSchema> & { _id: string };

export const SchoolFeeModel = models.SchoolFee || model("SchoolFee", SchoolFeeSchema);
