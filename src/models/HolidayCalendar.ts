import { model, models, Schema, type InferSchemaType } from "mongoose";

const HolidayCalendarSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, default: "Holiday Calendar 2026" },
    pdfUrl: { type: String, required: true, trim: true },
    publishedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export type HolidayCalendarDocument = InferSchemaType<typeof HolidayCalendarSchema> & { _id: string };

export const HolidayCalendarModel = models.HolidayCalendar || model("HolidayCalendar", HolidayCalendarSchema);
