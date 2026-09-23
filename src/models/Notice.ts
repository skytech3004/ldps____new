import { model, models, Schema, type InferSchemaType } from "mongoose";

const NoticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    body: {
      type: String,
      trim: true,
      default: "",
    },
    refNo: {
      type: String,
      trim: true,
      default: "",
    },
    signatory: {
      type: String,
      trim: true,
      default: "Dr. Preeti Sharma\nPrincipal, LPS Vidyawadi",
    },
    category: {
      type: String,
      required: true,
      enum: ["News & Circulars", "Announcements", "Admission", "School Rules"],
      default: "News & Circulars",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

NoticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

export type NoticeDocument = InferSchemaType<typeof NoticeSchema> & { _id: string };

export const NoticeModel = models.Notice || model("Notice", NoticeSchema);
