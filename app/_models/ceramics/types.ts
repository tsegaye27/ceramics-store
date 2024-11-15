import { Model } from "mongoose";
import { Document } from "mongoose";

export interface ICeramics extends Document {
  _id: string;
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

export interface ICeramicsModel extends Model<ICeramics> {
  getAllCeramics(): Promise<ICeramics[]>;
  getCeramicById(id: string): Promise<ICeramics | null>;
  searchCeramics(searchQuery: string): Promise<ICeramics[]>;
  addNewCeramic(newCeramic: ICeramics): Promise<ICeramics>;
  updateCeramic(
    id: string,
    updatedCeramic: ICeramics
  ): Promise<ICeramics | null>;
  deleteCeramic(id: string): Promise<ICeramics | null>;
}
