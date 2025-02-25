import { Schema } from "mongoose";
import { ICeramic } from "./types";

const ceramicSchema = new Schema<ICeramic>(
  {
    imageUrl: { type: String },
    size: { type: String, required: true },
    type: { type: String, required: true },
    code: { type: String, required: true },
    manufacturer: { type: String, required: true },
    totalPackets: { type: Number, required: true },
    totalPiecesWithoutPacket: { type: Number, required: true },
    piecesPerPacket: { type: Number, required: true },
  },
  { timestamps: true },
);

ceramicSchema.index({ code: 1, size: 1, manufacturer: 1 }, { unique: true });

export default ceramicSchema;
