import { model, models, Schema, type InferSchemaType } from "mongoose";

const AdmissionFeeSchema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    feeAmount: { type: String, required: true, trim: true },
    note: { type: String, default: "Charged only once at the time of new admission into the school.", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type AdmissionFeeDocument = InferSchemaType<typeof AdmissionFeeSchema> & { _id: string };

export const AdmissionFeeModel = models.AdmissionFee || model("AdmissionFee", AdmissionFeeSchema);
