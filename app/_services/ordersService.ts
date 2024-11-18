import { IOrder } from "../_models/orders/types";
import dbConnect from "../_lib/mongoose";
import Order from "../_models/orders";
import logger from "../_utils/logger";

export const serviceCreateOrder = async (
  order: IOrder
): Promise<IOrder | null> => {
  try {
    await dbConnect();
    return await Order.createOrder(order);
  } catch (error) {
    logger.error("Error creating order:", error);
    return null;
  }
};

export const serviceGetOrders = async (): Promise<IOrder[]> => {
  try {
    await dbConnect();
    return await Order.getOrders();
  } catch (error) {
    logger.error("Error fetching orders:", error);
    return [];
  }
};
