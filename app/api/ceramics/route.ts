import { Ceramic } from "@/app/_models/Ceramics";
import dbConnect from "@/app/_lib/mongoose";
import { ICeramic } from "@/app/_types/types";
import { formatPieces } from "@/app/_utils/helperFunctions";

export async function addNewCeramic(ceramicData: ICeramic) {
  await dbConnect();
  const { totalPackets, totalPiecesWithoutPacket, piecesPerPacket } =
    ceramicData;

  const { packets, pieces } = formatPieces(
    totalPackets,
    totalPiecesWithoutPacket,
    piecesPerPacket
  );

  const newCeramic = new Ceramic({
    ...ceramicData,
    totalPackets: packets,
    totalPiecesWithoutPacket: pieces,
  });
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

  const { packets, pieces } = formatPieces(
    packetsSold,
    piecesSold,
    ceramic.piecesPerPacket
  );

  if (packets > ceramic.totalPackets) {
    throw new Error("Not enough stock");
  }

  if (pieces > ceramic.totalPiecesWithoutPacket && ceramic.totalPackets > 0) {
    ceramic.totalPackets--;
    ceramic.totalPiecesWithoutPacket += ceramic.piecesPerPacket;
  } else {
    throw new Error("Not enough stock");
  }

  ceramic.totalPackets -= packets;
  ceramic.totalPiecesWithoutPacket -= pieces;

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

  let packets = ceramic.totalPackets + packetsAdded;
  let pieces = ceramic.totalPiecesWithoutPacket + piecesAdded;

  if (pieces >= ceramic.piecesPerPacket) {
    packets += Math.floor(pieces / ceramic.piecesPerPacket);
    pieces = pieces % ceramic.piecesPerPacket;
  }

  ceramic.totalPackets = packets;
  ceramic.totalPiecesWithoutPacket = pieces;

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
