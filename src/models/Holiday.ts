import { model, models, Schema, type InferSchemaType } from "mongoose";

const HolidaySchema = new Schema(
  {
    occasion: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    day: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ["National", "Gazetted", "Seasonal Break"], default: "Gazetted" },
  },
  { timestamps: true }
);

export type HolidayDocument = InferSchemaType<typeof HolidaySchema> & { _id: string };

export const HolidayModel = models.Holiday || model("Holiday", HolidaySchema);
