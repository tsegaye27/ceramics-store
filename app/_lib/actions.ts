"use server";

import { revalidatePath } from "next/cache";
import { ICeramics } from "../_models/ceramics/types";
import { IOrder } from "../_models/orders/types";
import {
  serviceAddNewCeramic,
  serviceAddToExistingCeramic,
  serviceGetAllCeramics,
  serviceGetCeramicById,
  serviceSearchCeramics,
  serviceSellCeramic,
} from "../_services/ceramicsService";
import {
  serviceCreateOrder,
  serviceGetOrders,
} from "../_services/ordersService";
import { validateCeramicData } from "./validators/ceramics";
import { redirect } from "next/navigation";

// Fetch orders
export const getOrdersAction = async (): Promise<IOrder[]> => {
  return await serviceGetOrders();
};

// Fetch ceramics with optional search query
export const getCeramicsAction = async (
  searchQuery: string
): Promise<ICeramics[]> => {
  return searchQuery
    ? await serviceSearchCeramics(searchQuery)
    : await serviceGetAllCeramics();
};

export const addNewCeramicAction = async (
  formData: FormData
): Promise<void> => {
  const ceramic: ICeramics = {
    size: formData.get("size") as string,
    manufacturer: formData.get("manufacturer") as string,
    code: formData.get("code") as string,
    piecesPerPacket: parseInt(formData.get("piecesPerPacket") as string, 10),
    totalPackets: parseInt(formData.get("totalPackets") as string, 10),
    totalPiecesWithoutPacket: parseInt(
      formData.get("totalPiecesWithoutPacket") as string,
      10
    ),
    type: formData.get("ceramicType") as string,
  };

  const validation = validateCeramicData(ceramic);

  if (!validation.success) {
    const errorMessages = validation.errors?.issues
      .map((issue) => `Error at "${issue.path.join(".")}": ${issue.message}`)
      .join("\n");
    throw new Error(errorMessages || "Invalid data provided.");
  }

  validation.data && (await serviceAddNewCeramic(validation.data));
  revalidatePath("/ceramics");
  redirect("/ceramics");
};

// Fetch ceramic by ID
export const getCeramicByIdAction = async (
  id: string
): Promise<ICeramics | null> => {
  return await serviceGetCeramicById(id);
};

// Add to an existing ceramic
export const addToExistingCeramicAction = async (
  formData: FormData,
  id: string
): Promise<void> => {
  const packetsToAdd = parseInt(formData.get("packetsToAdd") as string, 10);
  const piecesToAdd = parseInt(formData.get("piecesToAdd") as string, 10);

  await serviceAddToExistingCeramic(id, { packetsToAdd, piecesToAdd });
  revalidatePath(`/ceramics/${id}`);
};

// Sell a ceramic and create an order
export const sellCeramicAction = async (
  formData: FormData,
  id: string
): Promise<void> => {
  const packetsToSell = parseInt(formData.get("packetsToSell") as string, 10);
  const piecesToSell = parseInt(formData.get("piecesToSell") as string, 10);
  const pricePerArea = parseInt(formData.get("pricePerArea") as string, 10);
  const seller = formData.get("seller") as string;

  // Create an order
  await serviceCreateOrder({
    ceramicId: id,
    packets: packetsToSell,
    pieces: piecesToSell,
    seller,
    price: pricePerArea,
  });

  // Update the ceramic stock
  await serviceSellCeramic(id, {
    totalPackets: packetsToSell,
    totalPiecesWithoutPacket: piecesToSell,
  });

  revalidatePath(`/ceramics/${id}`);
};
