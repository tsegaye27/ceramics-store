import dbConnect from "../_lib/mongoose";
import Ceramics from "../_models/ceramics";
import { ICeramics } from "../_models/ceramics/types";

export const getAllCeramics = async (): Promise<ICeramics[]> => {
  try {
    await dbConnect();
    return await Ceramics.getAllCeramics();
  } catch (error) {
    console.error("Error fetching ceramics:", error);
    throw new Error("Failed to fetch ceramics.");
  }
};

export const searchCeramics = async (
  searchQuery: string
): Promise<ICeramics[]> => {
  try {
    await dbConnect();
    return await Ceramics.searchCeramics(searchQuery);
  } catch (error) {
    console.error("Error searching ceramics:", error);
    throw new Error("Failed to search ceramics.");
  }
};

export const getCeramicById = async (id: string): Promise<ICeramics | null> => {
  try {
    await dbConnect();
    return await Ceramics.getCeramicById(id);
  } catch (error) {
    console.error("Error fetching ceramic by ID:", error);
    throw new Error("Failed to fetch ceramic.");
  }
};

export const addNewCeramic = async (
  ceramicData: ICeramics
): Promise<ICeramics> => {
  {
    return await Ceramics.addNewCeramic(ceramicData);
  }
};

export const addToExistingCeramic = async (
  id: string,
  addData: { totalPackets: number; totalPiecesWithoutPacket: number }
): Promise<ICeramics> => {
  try {
    await dbConnect();
    return await Ceramics.addToExistingCeramic(id, addData);
  } catch (error) {
    console.error("Error adding to existing ceramic:", error);
    throw new Error("Failed to add to existing ceramic.");
  }
};

export const sellCeramic = async (
  id: string,
  sellData: { totalPackets: number; totalPiecesWithoutPacket: number }
): Promise<ICeramics> => {
  try {
    await dbConnect();
    return await Ceramics.sellCeramic(id, sellData);
  } catch (error) {
    console.error("Error selling ceramic:", error);
    throw new Error("Failed to sell ceramic.");
  }
};

export const deleteCeramic = async (id: string): Promise<boolean> => {
  try {
    const result = await Ceramics.deleteCeramic(id);
    return result !== null;
  } catch (error) {
    console.error("Error deleting ceramic:", error);
    throw new Error("Failed to delete ceramic.");
  }
};
