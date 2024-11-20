import {
  CeramicsManufacturersEnum,
  CeramicsSizesEnum,
  CeramicsTypesEnum,
} from "@/app/_utils/enums";
import { z } from "zod";

export const ceramicsSchemaZod = z
  .object({
    size: CeramicsSizesEnum,
    type: CeramicsTypesEnum,
    manufacturer: CeramicsManufacturersEnum,
    piecesPerPacket: z
      .number()
      .int()
      .positive()
      .describe("Number of pieces per packet must be a positive integer"),
    code: z.string().min(2).describe("Code must be at least 2 characters"),
    totalPackets: z
      .number()
      .int()
      .positive()
      .describe("Total packets must be a positive integer"),
    totalPiecesWithoutPacket: z
      .number()
      .int()
      .positive()
      .describe("Total pieces must be a positive integer"),
  })
  .refine((data) => data.totalPiecesWithoutPacket <= data.piecesPerPacket, {
    message: "Total pieces must be less than or equal to pieces per packet",
    path: ["totalPiecesWithoutPacket"],
  });
