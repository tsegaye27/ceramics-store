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

export type IUser = {
  _id?: string;
  email: string;
  name: string;
  role: string;
  fullName: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
};

export type IOrder = {
  _id?: string;
  ceramicId: ICeramic;
  userId: IUser;
  packets: number;
  pieces: number;
  price: number;
  seller: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface DecodedToken {
  id: string;
}
