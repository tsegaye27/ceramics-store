import { Model } from "mongoose";

export interface IOrder {
  ceramicId: {
    _id?: string;
    code: string;
    piecesPerPacket: string;
    size: string;
    createdAt?: string;
  };
  seller?: string;
  pieces: number;
  packets: number;
  createdAt?: Date;
  price: number;
}

export interface IOrderModel extends Model<IOrder> {
  createOrder(order: IOrder): Promise<IOrder>;
  getOrders(): Promise<IOrder[]>;
}
