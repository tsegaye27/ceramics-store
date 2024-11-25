// import { Model } from "mongoose";
// import { IOrder } from "./types";

// export async function createOrder(this: Model<IOrder>, order: IOrder) {
//   return (await this.create(order)).toObject();
// }

// export async function getOrders(this: Model<IOrder>) {
//   return await this.find({})
//     .populate("ceramicId", "code size piecesPerPacket")
//     .sort({
//       createdAt: 1,
//     })
//     .lean();
// }
