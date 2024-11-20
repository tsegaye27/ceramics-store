import dbConnect from "../_lib/mongoose";
import Ceramics from "../_models/ceramics";
import { ICeramics } from "../_models/ceramics/types";

export const serviceGetAllCeramics = async (): Promise<ICeramics[]> => {
  await dbConnect();
  return await Ceramics.getAllCeramics();
};

export const serviceSearchCeramics = async (
  searchQuery: string
): Promise<ICeramics[]> => {
  await dbConnect();
  return await Ceramics.searchCeramics(searchQuery);
};

export const serviceGetCeramicById = async (
  id: string
): Promise<ICeramics | null> => {
  await dbConnect();
  return await Ceramics.getCeramicById(id);
};
export const serviceAddNewCeramic = async (
  ceramicData: ICeramics
): Promise<ICeramics> => {
  {
    return await Ceramics.addNewCeramic(ceramicData);
  }
};

export const serviceAddToExistingCeramic = async (
  id: string,
  addData: { packetsToAdd: number; piecesToAdd: number }
): Promise<ICeramics | null> => {
  await dbConnect();
  return await Ceramics.addToExistingCeramic(id, addData);
};

export const serviceSellCeramic = async (
  id: string,
  sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
): Promise<ICeramics | null> => {
  await dbConnect();
  return await Ceramics.sellCeramic(id, sellData);
};

export const serviceDeleteCeramic = async (id: string): Promise<boolean> => {
  const result = await Ceramics.deleteCeramic(id);
  return result !== null;
};
