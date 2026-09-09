import { model, models, Schema, type InferSchemaType } from "mongoose";

const TeacherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type TeacherDocument = InferSchemaType<typeof TeacherSchema> & { _id: string };

export const TeacherModel = models.Teacher || model("Teacher", TeacherSchema);
