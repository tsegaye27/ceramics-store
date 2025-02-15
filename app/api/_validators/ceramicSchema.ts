import { ICeramic } from "@/app/_types/types";
import { z } from "zod";

const ceramicId = z.string().uuid("Invalid ceramic ID");
const packetsAdded = z
  .number()
  .int()
  .positive("Packets added must be a positive integer");
const piecesAdded = z
  .number()
  .int()
  .positive("Pieces added must be a positive integer");
const totalPackets = z
  .number()
  .int()
  .positive("Total packets must be a positive integer");
const totalPiecesWithoutPacket = z
  .number()
  .int()
  .positive("Total pieces without packet must be a positive integer");
const piecesPerPacket = z
  .number()
  .int()
  .positive("Pieces per packet must be a positive integer");
const packetsSold = z
  .number()
  .int()
  .positive("Packets sold must be a positive integer");
const piecesSold = z
  .number()
  .int()
  .positive("Pieces sold must be a positive integer");

export const updateCeramicSchema = z.object({
  ceramicId,
  packetsAdded,
  piecesAdded,
});

export const createCeramicSchema = z.object({
  totalPackets,
  totalPiecesWithoutPacket,
  piecesPerPacket,
  imageUrl: z.string().optional(),
  size: z.string(),
  type: z.string(),
  code: z.string(),
  manufacturer: z.string(),
});

export const soldCeramicSchema = z.object({
  ceramicId,
  packetsSold,
  piecesSold,
});
