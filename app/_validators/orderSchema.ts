import { z } from "zod";

const ceramicId = z.string().uuid("Invalid ceramic ID");
const packets = z
  .number()
  .int()
  .positive("Packets added must be a positive integer");
const pieces = z
  .number()
  .int()
  .positive("Pieces added must be a positive integer");
const price = z.number().int().positive("Price must be a positive integer");
const seller = z.string();

export const orderSchema = z.object({
  ceramicId,
  packets,
  pieces,
  price,
  seller,
});
