import { model, models, Schema, type InferSchemaType } from "mongoose";

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

TestimonialSchema.index({ status: 1, sortOrder: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & { _id: string };
export const TestimonialModel = models.Testimonial || model("Testimonial", TestimonialSchema);
