import mongoose from "mongoose";
import { Model } from "mongoose";

export interface IOrder extends Document {
  ceramicId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  seller: string;
  pieces: number;
  packets: number;
  createdAt: Date;
  price: number;
}

export interface IOrderModel extends Model<IOrder> {
  createOrder(order: IOrder): Promise<IOrder>;
}
