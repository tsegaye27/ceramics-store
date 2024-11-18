import { Model } from "mongoose";
import { ICeramics } from "./types";
import {
  checkSufficiency,
  formatPieces,
  validateInput,
} from "@/app/_utils/helperFunctions";
import logger from "@/app/_utils/logger";

export async function getAllCeramics(this: Model<ICeramics>) {
  const ceramics: ICeramics[] = await this.find({})
    .sort({
      totalPackets: 1,
      createdAt: -1,
    })
    .lean();
  if (!ceramics) {
    logger.error("Ceramics not found.");
  }
  return ceramics;
}

export async function getCeramicById(this: Model<ICeramics>, id: string) {
  const ceramic: ICeramics | null = await this.findById(id).lean();
  if (!ceramic) {
    logger.error("Ceramic not found.");
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
  }).lean();
  if (!ceramics) {
    logger.error("Ceramics not found.");
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
      logger.warn("Ceramic already exists.");
    }
    logger.error("Failed to add ceramic.");
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
    logger.error("Ceramic not found.");
    return;
  }

  if (packets < 0 || pieces < 0) {
    logger.warn("Invalid data.");
    return;
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
  ).lean();
}

export async function sellCeramic(
  this: Model<ICeramics>,
  id: string,
  sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
) {
  const { totalPackets, totalPiecesWithoutPacket } = sellData;
  const ceramic: ICeramics | null = await this.findById(id);

  if (!ceramic) {
    logger.error("Ceramic not found.");
    return;
  }

  const isInputValid = validateInput(totalPackets, totalPiecesWithoutPacket)
    ? {}
    : logger.warn("Invalid data.");

  const { packetsToAdd: packetsToSell, piecesToAdd: piecesToSell } =
    formatPieces(
      totalPackets,
      totalPiecesWithoutPacket,
      ceramic.piecesPerPacket
    );

  const isSufficient = checkSufficiency(
    totalPackets,
    packetsToSell,
    totalPiecesWithoutPacket,
    piecesToSell
  );

  if (!isInputValid || !isSufficient) {
    return;
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
  ).lean();
}

export async function deleteCeramic(this: Model<ICeramics>, id: string) {
  return await this.findByIdAndDelete(id).lean();
}
