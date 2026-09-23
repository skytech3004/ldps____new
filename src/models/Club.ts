import { model, models, Schema, type InferSchemaType } from "mongoose";

const ClubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export type ClubDocument = InferSchemaType<typeof ClubSchema> & { _id: string };

export const ClubModel = models.Club || model("Club", ClubSchema);
