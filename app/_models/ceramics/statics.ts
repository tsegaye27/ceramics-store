import { Model } from "mongoose";
import { ICeramics } from "./types";

export async function getAllCeramics(this: Model<ICeramics>) {
  const ceramics: ICeramics[] | null = await this.find({}).sort({
    totalPackets: 1,
    createdAt: -1,
  });
  if (!ceramics) {
    throw new Error("Ceramics not found.");
  }
  return ceramics;
}

export async function getCeramicById(this: Model<ICeramics>, id: string) {
  const ceramic: ICeramics | null = await this.findById(id);
  if (!ceramic) {
    throw new Error("Ceramic not found.");
  }
  return ceramic;
}

export async function searchCeramics(
  this: Model<ICeramics>,
  searchQuery: string
) {
  const ceramics: ICeramics[] | null = await this.find({
    $or: [
      { size: { $regex: searchQuery, $options: "i" } },
      { type: { $regex: searchQuery, $options: "i" } },
      { manufacturer: { $regex: searchQuery, $options: "i" } },
      { code: { $regex: searchQuery, $options: "i" } },
    ],
  });
  if (!ceramics) {
    throw new Error("Ceramics not found.");
  }
  return ceramics;
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
  addData: { totalPackets: number; totalPiecesWithoutPacket: number }
) {
  const { totalPackets, totalPiecesWithoutPacket } = addData;
  const ceramic: ICeramics | null = await this.findById(id);
  let packetsToAdd = totalPackets || 0;
  let piecesToAdd = totalPiecesWithoutPacket || 0;

  if (!ceramic) {
    throw new Error("Ceramic not found.");
  }

  if (packetsToAdd < 0 || piecesToAdd < 0) {
    throw new Error("Invalid data.");
  }

  if (piecesToAdd >= ceramic.piecesPerPacket) {
    packetsToAdd += Math.floor(piecesToAdd / ceramic.piecesPerPacket);
    piecesToAdd %= ceramic.piecesPerPacket;
  }

  return await this.findByIdAndUpdate(
    id,
    {
      $inc: {
        totalPackets: packetsToAdd,
        totalPiecesWithoutPacket: piecesToAdd,
      },
    },
    { new: true }
  );
}

export async function sellCeramic(
  this: Model<ICeramics>,
  id: string,
  sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
) {
  const { totalPackets, totalPiecesWithoutPacket } = sellData;
  const ceramic: ICeramics | null = await this.findById(id);
  let packetsToSell = totalPackets || 0;
  let piecesToSell = totalPiecesWithoutPacket || 0;

  if (!ceramic) {
    throw new Error("Ceramic not found.");
  }

  if (packetsToSell < 0 || piecesToSell < 0) {
    throw new Error("Invalid data.");
  }

  if (piecesToSell >= ceramic.piecesPerPacket) {
    packetsToSell += Math.floor(piecesToSell / ceramic.piecesPerPacket);
    piecesToSell %= ceramic.piecesPerPacket;
  }

  if (ceramic.totalPackets < packetsToSell) {
    throw new Error("Insufficient packets.");
  }

  if (
    ceramic.totalPackets === packetsToSell &&
    ceramic.totalPiecesWithoutPacket < piecesToSell
  ) {
    throw new Error("Insufficient pieces.");
  }

  return await this.findByIdAndUpdate(
    id,
    {
      $inc: {
        totalPackets: -packetsToSell,
        totalPiecesWithoutPacket: -piecesToSell,
      },
    },
    { new: true }
  );
}

export async function deleteCeramic(this: Model<ICeramics>, id: string) {
  return await this.findByIdAndDelete(id);
}
