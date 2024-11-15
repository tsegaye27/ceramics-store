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
