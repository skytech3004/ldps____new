import { model, models, Schema, type InferSchemaType } from "mongoose";

const InquirySchema = new Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
    },
    classApplied: {
      type: String,
      required: true,
      trim: true,
    },
    streamSelected: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    admissionCategory: {
      type: String,
      default: "",
      trim: true,
    },
    whatsAppNo: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "New Inquiry",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export type InquiryDocument = InferSchemaType<typeof InquirySchema> & { _id: string };

export const InquiryModel = models.Inquiry || model("Inquiry", InquirySchema);
