import { Types } from "mongoose";

export interface IOrder {
  ceramicId: Types.ObjectId;
  userId: Types.ObjectId;
  packets: number;
  pieces: number;
  price: number;
  seller: string;
}
