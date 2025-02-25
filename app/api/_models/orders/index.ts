import mongoose from "mongoose";
import orderSchema from "./schema";
import { IOrder } from "./types";

const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
