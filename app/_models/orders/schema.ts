import { Schema } from "mongoose";
import { IOrder } from "./types";

export const orderSchema: Schema<IOrder> = new Schema(
  {
    ceramicId: {
      type: Schema.Types.ObjectId,
      ref: "Ceramics",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: String,
      default: "Ananiya Shop",
    },
    pieces: {
      type: Number,
      required: true,
    },
    packets: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
