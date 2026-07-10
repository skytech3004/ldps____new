import { model, models, Schema, type InferSchemaType } from "mongoose";

const TopperSchema = new Schema({
  name: { type: String, required: true, trim: true },
  class: { type: String, required: true, enum: ["Class X", "Class XII"], trim: true },
  stream: { type: String, default: "General", trim: true },
  score: { type: String, required: true, trim: true },
  rank: { type: Number, required: true },
  medal: { type: String, default: "star", trim: true },
  description: { type: String, default: "", trim: true },
});

const ResultStudentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  class: { type: String, required: true, enum: ["Class X", "Class XII"], trim: true },
  stream: { type: String, default: "General", trim: true },
  percent: { type: Number, required: true },
  status: { type: String, required: true, trim: true },
});

const BoardResultSchema = new Schema(
  {
    year: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    passPercentage: {
      type: String,
      default: "100%",
      trim: true,
    },
    highestScore: {
      type: String,
      default: "0.0%",
      trim: true,
    },
    highestScoreScorer: {
      type: String,
      default: "",
      trim: true,
    },
    distinctionsCount: {
      type: Number,
      default: 0,
    },
    batchAverage: {
      type: String,
      default: "0.0%",
      trim: true,
    },
    toppers: {
      type: [TopperSchema],
      default: [],
    },
    students: {
      type: [ResultStudentSchema],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type BoardResultDocument = InferSchemaType<typeof BoardResultSchema> & { _id: string };

export const BoardResultModel = models.BoardResult || model("BoardResult", BoardResultSchema);
