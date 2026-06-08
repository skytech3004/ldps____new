import { model, models, Schema, type InferSchemaType } from "mongoose";

const CarouselSlideSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
});

const CarouselSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "homepage",
      trim: true,
    },
    slides: {
      type: [CarouselSlideSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type CarouselDocument = InferSchemaType<typeof CarouselSchema> & { _id: string };

export const CarouselModel = models.Carousel || model("Carousel", CarouselSchema);
