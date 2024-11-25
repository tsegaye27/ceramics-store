// import { Model } from "mongoose";

// export interface ICeramics {
//   _id?: string;
//   size: string;
//   type: string;
//   manufacturer: string;
//   piecesPerPacket: number;
//   code: string;
//   totalArea?: number;
//   totalPackets: number;
//   totalPiecesWithoutPacket: number;
//   imageUrl?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface ICeramicsModel extends Model<ICeramics> {
//   getAllCeramics(): Promise<ICeramics[]>;
//   getCeramicById(id: string): Promise<ICeramics | null>;
//   searchCeramics(searchQuery: string): Promise<ICeramics[]>;
//   addNewCeramic(newCeramic: ICeramics): Promise<ICeramics>;
//   addToExistingCeramic(
//     id: string,
//     addData: { packetsToAdd: number; piecesToAdd: number }
//   ): Promise<ICeramics>;
//   sellCeramic(
//     id: string,
//     sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
//   ): Promise<ICeramics>;
//   deleteCeramic(id: string): Promise<ICeramics | null>;
// }
