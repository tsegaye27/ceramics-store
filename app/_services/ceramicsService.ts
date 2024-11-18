import dbConnect from "../_lib/mongoose";
import Ceramics from "../_models/ceramics";
import { ICeramics } from "../_models/ceramics/types";
import { validateInput } from "../_utils/helperFunctions";
import logger from "../_utils/logger";

export const serviceGetAllCeramics = async (): Promise<ICeramics[]> => {
  try {
    await dbConnect();
    return await Ceramics.getAllCeramics();
  } catch (error) {
    logger.error("Error fetching ceramics:", error);
    return [];
  }
};

export const serviceSearchCeramics = async (
  searchQuery: string
): Promise<ICeramics[]> => {
  try {
    await dbConnect();
    return await Ceramics.searchCeramics(searchQuery);
  } catch (error) {
    logger.error("Error searching ceramics:", error);
    return [];
  }
};

export const serviceGetCeramicById = async (
  id: string
): Promise<ICeramics | null> => {
  try {
    await dbConnect();
    return await Ceramics.getCeramicById(id);
  } catch (error) {
    logger.error("Error fetching ceramic by ID:", error);
    return null;
  }
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
  try {
    await dbConnect();
    return await Ceramics.addToExistingCeramic(id, addData);
  } catch (error) {
    logger.error("Error adding to existing ceramic:", error);
    return null;
  }
};

export const serviceSellCeramic = async (
  id: string,
  sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
): Promise<ICeramics | null> => {
  try {
    await dbConnect();
    return await Ceramics.sellCeramic(id, sellData);
  } catch (error) {
    logger.error("Error selling ceramic:", error);
    return null;
  }
};

export const serviceDeleteCeramic = async (id: string): Promise<boolean> => {
  try {
    const result = await Ceramics.deleteCeramic(id);
    return result !== null;
  } catch (error) {
    logger.error("Error deleting ceramic:", error);
    return false;
  }
};
