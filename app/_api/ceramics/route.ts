import { Ceramic } from "@/app/_models/Ceramics";
import dbConnect from "@/app/_lib/mongoose";
import { ICeramic } from "@/app/_types/types";

export async function addNewCeramic(ceramicData: ICeramic) {
  await dbConnect();

  const newCeramic = new Ceramic(ceramicData);
  return await newCeramic.save();
}

export async function sellCeramic(
  ceramicId: string,
  packetsSold: number,
  piecesSold: number
) {
  await dbConnect();

  const ceramic = await Ceramic.findById(ceramicId);
  if (!ceramic) throw new Error("Ceramic not found");

  const totalPiecesSold = packetsSold * ceramic.piecesPerPacket + piecesSold;

  const totalAvailablePieces =
    ceramic.totalPackets * ceramic.piecesPerPacket +
    ceramic.totalPiecesWithoutPacket;
  if (totalPiecesSold > totalAvailablePieces) {
    throw new Error("Insufficient stock");
  }

  ceramic.totalPackets -= packetsSold;
  ceramic.totalPiecesWithoutPacket -= piecesSold;

  while (ceramic.totalPiecesWithoutPacket < 0 && ceramic.totalPackets > 0) {
    ceramic.totalPackets--;
    ceramic.totalPiecesWithoutPacket += ceramic.piecesPerPacket;
  }

  return await ceramic.save();
}

export async function addCeramicById(
  ceramicId: string,
  packetsAdded: number,
  piecesAdded: number
) {
  await dbConnect();

  const ceramic = await Ceramic.findById(ceramicId);
  if (!ceramic) throw new Error("Ceramic not found");

  ceramic.totalPackets += packetsAdded;
  ceramic.totalPiecesWithoutPacket += piecesAdded;

  return await ceramic.save();
}

export async function getCeramicById(ceramicId: string) {
  await dbConnect();
  const ceramic = await Ceramic.findById(ceramicId);
  if (!ceramic) throw new Error("Ceramic not found");
  return ceramic;
}

export async function getAllCeramics() {
  await dbConnect();
  return await Ceramic.find({});
}
