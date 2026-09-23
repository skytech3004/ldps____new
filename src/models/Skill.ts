import { model, models, Schema, type InferSchemaType } from "mongoose";

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
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

export type SkillDocument = InferSchemaType<typeof SkillSchema> & { _id: string };

export const SkillModel = models.Skill || model("Skill", SkillSchema);
