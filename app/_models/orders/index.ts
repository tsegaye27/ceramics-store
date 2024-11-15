import mongoose, { Model } from "mongoose";
import { orderSchema } from "./schema";
import * as Statics from "./statics";
import { IOrder, IOrderModel } from "./types";

orderSchema.static(Statics);

const Order =
  (mongoose.models.Order as unknown as IOrderModel) ||
  mongoose.model<IOrder, IOrderModel>("Order", orderSchema);

export default Order;
