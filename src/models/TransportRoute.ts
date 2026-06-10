import { model, models, Schema, type InferSchemaType } from "mongoose";

const TransportRouteSchema = new Schema(
  {
    routeNo: { type: String, required: true, trim: true },
    driver: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    stops: [{ type: String, trim: true }],
    timing: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type TransportRouteDocument = InferSchemaType<typeof TransportRouteSchema> & { _id: string };

export const TransportRouteModel = models.TransportRoute || model("TransportRoute", TransportRouteSchema);
