import { Schema } from "mongoose";
import { IOrder } from "./types";

const orderSchema = new Schema<IOrder>(
  {
    ceramicId: {
      type: Schema.Types.ObjectId,
      ref: "Ceramic",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packets: { type: Number, required: true, min: 1 },
    pieces: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    seller: { type: String, required: true },
  },
  { timestamps: true },
);

export default orderSchema;
