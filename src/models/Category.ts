import { model, models, Schema, type InferSchemaType } from "mongoose";

const CategoryItemSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, default: "#" },
});

const CategorySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "homepage",
      trim: true,
    },
    items: {
      type: [CategoryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema> & { _id: string };

export const CategoryModel = models.Category || model("Category", CategorySchema);
