import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/app/_types/types";
const orderSchema = new Schema<IOrder>(
  {
    ceramicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ceramic",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export { Order };
