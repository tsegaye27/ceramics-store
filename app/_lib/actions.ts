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

export const getOrdersAction = async () => {
  const orders: IOrder[] = await serviceGetOrders();
  return orders;
};

export const getCeramicsAction = async (searchQuery: string) => {
  const ceramics = searchQuery
    ? await serviceSearchCeramics(searchQuery)
    : await serviceGetAllCeramics();
  return ceramics;
};

export const addNewCeramicAction = async (formData: FormData) => {
  const size = formData.get("size") as string;
  const manufacturer = formData.get("manufacturer") as string;
  const code = formData.get("code") as string;
  const piecesPerPacket = parseInt(
    formData.get("piecesPerPacket") as string,
    10
  );
  const totalPackets = parseInt(formData.get("totalPackets") as string, 10);
  const totalPiecesWithoutPacket = parseInt(
    formData.get("totalPiecesWithoutPacket") as string,
    10
  );
  const ceramicType = formData.get("ceramicType") as string;

  const ceramic: ICeramics = {
    size,
    manufacturer,
    code,
    piecesPerPacket,
    totalPackets,
    totalPiecesWithoutPacket,
    type: ceramicType,
  };
  await serviceAddNewCeramic(ceramic);
  revalidatePath("/ceramics");
};

export const getCeramicByIdAction = async (id: string) => {
  const ceramic: ICeramics | null = await serviceGetCeramicById(id);
  return ceramic;
};

export const addToExistingCeramicAction = async (
  formData: FormData,
  id: string
) => {
  const packetsToAdd = parseInt(formData.get("packetsToAdd") as string, 10);
  const piecesToAdd = parseInt(formData.get("piecesToAdd") as string, 10);

  await serviceAddToExistingCeramic(id, {
    packetsToAdd,
    piecesToAdd,
  });
  revalidatePath("/ceramics");
};

export const sellCeramicAction = async (formData: FormData, id: string) => {
  const packetsToSell = parseInt(formData.get("packetsToSell") as string, 10);
  const piecesToSell = parseInt(formData.get("piecesToSell") as string, 10);
  const pricePerArea = parseInt(formData.get("pricePerArea") as string, 10);
  const seller = formData.get("seller") as string;

  await serviceCreateOrder({
    ceramicId: id,
    pieces: piecesToSell,
    packets: packetsToSell,
    seller,
    price: pricePerArea,
  });

  await serviceSellCeramic(id, {
    totalPackets: packetsToSell,
    totalPiecesWithoutPacket: piecesToSell,
  });
  revalidatePath("/ceramics");
};
