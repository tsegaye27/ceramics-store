import { z } from "zod";

const totalPackets = z.coerce
  .number({
    required_error: "Total packets is required",
    invalid_type_error: "Total packets must be a number",
  })
  .min(0, "Total packets cannot be negative");
const totalPiecesWithoutPacket = z.coerce
  .number({
    required_error: "Total pieces without packet is required",
    invalid_type_error: "Total pieces without packet must be a number",
  })
  .min(0, "Total pieces without packet cannot be negative");
const piecesPerPacket = z.coerce
  .number({
    required_error: "Pieces per packet is required",
    invalid_type_error: "Pieces per packet must be a number",
  })
  .min(1, "Pieces per packet must be at least 1");
const packetsSold = z
  .number({
    required_error: "Packets sold is required",
    invalid_type_error: "Packets sold must be a number",
  })
  .int()
  .min(0, "packets sold can't be a negative number")
  .default(0);
const piecesSold = z
  .number({
    required_error: "Pieces sold is required",
    invalid_type_error: "Pieces sold must be a number",
  })
  .int()
  .min(0, "Pieces sold can't be a negative number")
  .default(0);
const pricePerArea = z
  .number({
    required_error: "Price per area is required",
    invalid_type_error: "Price per area must be a number",
  })
  .positive("Price per area must be greater than zero");
const seller = z
  .string({
    required_error: "Seller is required",
    invalid_type_error: "Seller must be a string",
  })
  .min(1, "Seller is required");

export const updateCeramicSchema = z.object({
  packetsAdded: z
    .number({
      required_error: "Packets added is required",
      invalid_type_error: "Packets added must be a number",
    })
    .int()
    .min(0, "Packets added can't be a negative number")
    .default(0),
  piecesAdded: z
    .number({
      required_error: "Pieces added is required",
      invalid_type_error: "Pieces added must be a number",
    })
    .int()
    .min(0, "Pieces added can't be a negative number")
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
  packetsSold,
  piecesSold,
  pricePerArea,
  seller,
});

export type CeramicFormData = z.infer<typeof createCeramicSchema>;
