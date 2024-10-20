import mongoose, { Document, Schema, Model } from "mongoose";

interface IOrder extends Document {
  ceramicId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  seller: string;
  pieces: number;
  packets: number;
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
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
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
export type { IOrder };
