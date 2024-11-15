import { Model } from "mongoose";
import { IOrder } from "../Order";

export async function createOrder(this: Model<IOrder>, order: IOrder) {
  return this.create(order);
}
