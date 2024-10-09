import mongoose, { Schema, model, Document } from "mongoose";

interface ICeramics extends Document {
  size: string;
  type: string;
  manufacturer: string;
  piecesPerPacket: number;
  code: string;
  totalArea?: number;
  totalPackets: number;
  totalPiecesWithoutPacket: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ceramicsSchema = new Schema<ICeramics>(
  {
    size: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    piecesPerPacket: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    totalArea: {
      type: Number,
    },
    totalPackets: {
      type: Number,
      required: true,
    },
    totalPiecesWithoutPacket: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Ceramics =
  mongoose.models.Ceramics ||
  mongoose.model<ICeramics>("Ceramics", ceramicsSchema);

export default Ceramics;
export type { ICeramics };
