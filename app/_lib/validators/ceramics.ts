import { formatZodErrors } from "@/app/_utils/helperFunctions";
import { string, z, ZodError } from "zod";

export const ceramicsSchemaZod = z
  .object({
    size: string(),
    type: string(),
    manufacturer: string(),
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

export const validateCeramicData = (data: unknown) => {
  try {
    const validatedData = ceramicsSchemaZod.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
};
