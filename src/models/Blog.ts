import { model, models, Schema, type InferSchemaType } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    author: { type: String, default: "Admin", trim: true },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
  },
  { timestamps: true }
);

export type BlogDocument = InferSchemaType<typeof BlogSchema> & { _id: string };
export const BlogModel = models.Blog || model("Blog", BlogSchema);
