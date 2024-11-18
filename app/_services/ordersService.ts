import { IOrder } from "../_models/orders/types";
import dbConnect from "../_lib/mongoose";
import Order from "../_models/orders";

export const serviceCreateOrder = async (
  order: IOrder
): Promise<IOrder | null> => {
  await dbConnect();
  return await Order.createOrder(order);
};

export const serviceGetOrders = async (): Promise<IOrder[]> => {
  await dbConnect();
  return await Order.getOrders();
};
