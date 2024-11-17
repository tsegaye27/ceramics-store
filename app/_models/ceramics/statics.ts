import { Model } from "mongoose";
import { ICeramics } from "./types";
import { formatPieces } from "@/app/_utils/helperFunctions";

export async function getAllCeramics(this: Model<ICeramics>) {
  const ceramics: ICeramics[] = await this.find({}).sort({
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
  const ceramics: ICeramics[] = await this.find({
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
  try {
    const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
      newCeramic;
    const { packetsToAdd, piecesToAdd } = formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      piecesPerPacket
    );
    const nCeramic = await this.create({
      ...newCeramic,
      totalPackets: packetsToAdd,
      totalPiecesWithoutPacket: piecesToAdd,
    });

    return nCeramic.toObject();
  } catch (error: any) {
    if (error.code === 11000) {
      console.log("Ceramic already exists.");
    }
    console.log("Failed to add ceramic.");
  }
}

export async function addToExistingCeramic(
  this: Model<ICeramics>,
  id: string,
  addData: { packetsToAdd: number; piecesToAdd: number }
) {
  const { packetsToAdd, piecesToAdd } = addData;
  const ceramic: ICeramics | null = await this.findById(id);
  let packets = packetsToAdd || 0;
  let pieces = piecesToAdd || 0;

  if (!ceramic) {
    throw new Error("Ceramic not found.");
  }

  if (packets < 0 || pieces < 0) {
    throw new Error("Invalid data.");
  }

  if (pieces >= ceramic.piecesPerPacket) {
    packets += Math.floor(piecesToAdd / ceramic.piecesPerPacket);
    packets %= ceramic.piecesPerPacket;
  }

  return await this.findByIdAndUpdate(
    id,
    {
      $inc: {
        totalPackets: packets,
        totalPiecesWithoutPacket: pieces,
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
