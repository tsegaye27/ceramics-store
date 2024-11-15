import { Model } from "mongoose";
import { ICeramics } from "./types";

export async function getAllCeramics(this: Model<ICeramics>) {
  return await this.find({}).sort({
    totalPackets: 1,
    createdAt: -1,
  });
}

export async function getCeramicById(this: Model<ICeramics>, id: string) {
  return await this.findById(id);
}

export async function searchCeramics(
  this: Model<ICeramics>,
  searchQuery: string
) {
  return await this.find({
    $or: [
      { size: { $regex: searchQuery, $options: "i" } },
      { type: { $regex: searchQuery, $options: "i" } },
      { manufacturer: { $regex: searchQuery, $options: "i" } },
      { code: { $regex: searchQuery, $options: "i" } },
    ],
  });
}

export async function addNewCeramic(
  this: Model<ICeramics>,
  newCeramic: ICeramics
) {
  return await this.create(newCeramic);
}
