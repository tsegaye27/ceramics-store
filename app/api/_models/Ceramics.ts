import mongoose, { Schema } from "mongoose";
import { ICeramic } from "../../_types/types";

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
  { timestamps: true }
);

ceramicSchema.index({ code: 1, size: 1, manufacturer: 1 }, { unique: true });

const Ceramic =
  mongoose.models.Ceramic || mongoose.model("Ceramic", ceramicSchema);

export { Ceramic };
