import { z } from "zod";

const ceramicId = z.string().uuid("Invalid ceramic ID");
const totalPackets = z.coerce
  .number()
  .min(0, "Total packets cannot be negative");
const totalPiecesWithoutPacket = z.coerce
  .number()
  .min(0, "Total pieces without packet cannot be negative");
const piecesPerPacket = z.coerce
  .number()
  .min(1, "Pieces per packet must be at least 1");
const packetsSold = z
  .number()
  .int()
  .positive("Packets sold must be a positive integer");
const piecesSold = z
  .number()
  .int()
  .positive("Pieces sold must be a positive integer");

export const updateCeramicSchema = z.object({
  packetsAdded: z
    .number()
    .int()
    .positive("Packets added must be a positive integer")
    .default(0),
  piecesAdded: z
    .number()
    .int()
    .positive("Pieces added must be a positive integer")
    .default(0),
});

export const createCeramicSchema = z.object({
  totalPackets,
  totalPiecesWithoutPacket,
  piecesPerPacket,
  imageUrl: z.string().url("Invalid image URL").optional(),
  size: z.string().min(1, "Size is Required"),
  type: z.string().min(1, "Type is Required"),
  code: z.string().min(1, "Code is Required"),
  manufacturer: z.string().min(1, "Manufacturer is Required"),
});

export const soldCeramicSchema = z.object({
  ceramicId,
  packetsSold,
  piecesSold,
});

export type CeramicFormData = z.infer<typeof createCeramicSchema>;
