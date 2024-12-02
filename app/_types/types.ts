export type ICeramic = {
  _id?: string;
  imageUrl?: string;
  size: string;
  type: string;
  code: string;
  manufacturer: string;
  totalPackets: number;
  totalPiecesWithoutPacket: number;
  piecesPerPacket: number;
  createdAt?: string;
  updatedAt?: string;
};

export type IOrder = {
  _id?: string;
  ceramicId: ICeramic;
  userId: string;
  packets: number;
  pieces: number;
  price: number;
  seller: string;
  createdAt?: string;
  updatedAt?: string;
};
