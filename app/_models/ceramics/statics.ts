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

export async function addToExistingCeramic(
  this: Model<ICeramics>,
  id: string,
  updatedCeramic: Partial<ICeramics>
) {
  const ceramic: ICeramics | null = await this.findById(id);
  while (
    updatedCeramic.totalPiecesWithoutPacket &&
    ceramic?.piecesPerPacket &&
    updatedCeramic.totalPiecesWithoutPacket > ceramic.piecesPerPacket
  ) {
    updatedCeramic.totalPackets && updatedCeramic.totalPackets++;
    updatedCeramic.totalPiecesWithoutPacket &&
      ceramic.piecesPerPacket &&
      (updatedCeramic.totalPiecesWithoutPacket -= ceramic?.piecesPerPacket);
  }
  return await this.findByIdAndUpdate(id, updatedCeramic, {
    new: true,
    runValidators: true,
  });
}

export async function deleteCeramic(this: Model<ICeramics>, id: string) {
  return await this.findByIdAndDelete(id);
}
