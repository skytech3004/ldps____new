import { model, models, Schema, type InferSchemaType } from "mongoose";

const BusFeeSchema = new Schema(
  {
    sNo: { type: Number, required: true },
    place: { type: String, required: true, trim: true },
    fee: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type BusFeeDocument = InferSchemaType<typeof BusFeeSchema> & { _id: string };

export const BusFeeModel = models.BusFee || model("BusFee", BusFeeSchema);
