import { model, models, Schema, type InferSchemaType } from "mongoose";

const PlayerSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  achievement: { type: String, required: true },
  image: { type: String, default: "" }, // player photo URL
});

const GameSummarySchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const SportsStatSchema = new Schema({
  count: { type: String, required: true },
  label: { type: String, required: true },
});

const SportsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    complexImages: { type: [String], default: [] }, // carousel images
    players: { type: [PlayerSchema], default: [] },
    games: { type: [GameSummarySchema], default: [] },
    stats: { type: [SportsStatSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export type SportsDocument = InferSchemaType<typeof SportsSchema> & { _id: string };
export const SportsModel = models.Sports || model("Sports", SportsSchema);
