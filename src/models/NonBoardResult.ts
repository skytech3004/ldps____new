import { model, models, Schema, type InferSchemaType } from "mongoose";

const NonBoardResultSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      default: "2024-25",
      trim: true,
    },
    classLevel: {
      type: String,
      default: "General",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type NonBoardResultDocument = InferSchemaType<typeof NonBoardResultSchema> & { _id: string };

export const NonBoardResultModel =
  models.NonBoardResult || model("NonBoardResult", NonBoardResultSchema);
