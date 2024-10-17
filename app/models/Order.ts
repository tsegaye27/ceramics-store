import mongoose, { Document, Schema, Model } from "mongoose";

interface ISellOrder extends Document {
  ceramicId: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  pieces: number;
  packets: number;
  createdAt: Date;
}

const SellOrderSchema: Schema<ISellOrder> = new Schema(
  {
    ceramicId: {
      type: Schema.Types.ObjectId,
      ref: "Ceramic",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const SellOrder: Model<ISellOrder> = mongoose.model<ISellOrder>(
  "Order",
  SellOrderSchema
);

export default SellOrder;
export type { ISellOrder };
