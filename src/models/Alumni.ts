import { model, models, Schema, type InferSchemaType } from "mongoose";

const AlumniSchema = new Schema(
  {
    // Personal Details
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    parentsName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    alternateMobile: {
      type: String,
      default: "",
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // Academic Details
    classCompleted: {
      type: String,
      required: true,
      trim: true,
    },
    passingYear: {
      type: String,
      required: true,
      trim: true,
    },
    admissionYear: {
      type: String,
      default: "",
      trim: true,
    },
    rollNumber: {
      type: String,
      default: "",
      trim: true,
    },

    // Current Professional Details
    occupation: {
      type: String,
      default: "",
      trim: true,
    },
    organization: {
      type: String,
      default: "",
      trim: true,
    },
    officeAddress: {
      type: String,
      default: "",
      trim: true,
    },
    workEmail: {
      type: String,
      default: "",
      trim: true,
    },

    // Higher Education (If Applicable)
    higherEducation: {
      type: String,
      default: "",
      trim: true,
    },
    institutionName: {
      type: String,
      default: "",
      trim: true,
    },
    completionYear: {
      type: String,
      default: "",
      trim: true,
    },

    // Additional Details
    achievements: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: String,
      default: "",
      trim: true,
    },
    willingToMentor: {
      type: Boolean,
      default: false,
    },
    interestedInEvents: {
      type: Boolean,
      default: false,
    },

    // Admin Status
    status: {
      type: String,
      default: "Pending",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type AlumniDocument = InferSchemaType<typeof AlumniSchema> & { _id: string };

export const AlumniModel = models.Alumni || model("Alumni", AlumniSchema);
