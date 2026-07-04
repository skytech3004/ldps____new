import { model, models, Schema, type InferSchemaType } from "mongoose";

const FacilitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fallback: {
      type: String,
      default: "/lps-vidhyawadi/gallery-01.jpg",
      trim: true,
    },
    code: {
      type: String,
      default: "",
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export type FacilityDocument = InferSchemaType<typeof FacilitySchema> & { _id: string };

export const FacilityModel = models.Facility || model("Facility", FacilitySchema);
