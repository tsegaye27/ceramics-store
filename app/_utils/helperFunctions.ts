import logger from "./logger";

export const formatDate = (unformattedDate: string) => {
  const date = new Date(unformattedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hours = new Date(unformattedDate).getHours();
  const min = new Date(unformattedDate).getMinutes();
  const time = hours >= 12 ? "pm" : "am";
  return date + " at " + hours + ":" + min + " " + time.toUpperCase();
};

export const formatPieces = (
  totalPackets: number,
  totalPiecesWithoutPacket: number,
  piecesPerPacket: number
) => {
  let packetsToAdd = totalPackets;
  let piecesToAdd = totalPiecesWithoutPacket;
  let ppp = piecesPerPacket;

  if (piecesToAdd >= ppp) {
    packetsToAdd += Math.floor(piecesToAdd / ppp);
    piecesToAdd %= ppp;
  }
  return { packetsToAdd, piecesToAdd };
};

export const validateInput = (
  totalPackets: number,
  totalPiecesWithoutPacket: number
): boolean => {
  if (totalPackets < 0 || totalPiecesWithoutPacket < 0) {
    logger.warn("Invalid Data");
    return false;
  }
  return true;
};

export const checkSufficiency = (
  packetsAvailable: number,
  packetsToSell: number,
  piecesAvailable: number,
  piecesToSell: number
): boolean => {
  if (packetsAvailable < packetsToSell) {
    logger.warn("Insufficient packets.");
    return false;
  }

  if (packetsAvailable === packetsToSell && piecesAvailable < piecesToSell) {
    logger.warn("Insufficient pieces.");
    return false;
  }
  return true;
};

export const calculateArea = (
  totalPackets: number,
  totalPiecesWithoutPacket: number,
  piecesPerPacket: string,
  size: string
) => {
  const ppp = Number(piecesPerPacket);
  if (size === "60x60") {
    const area = totalPackets * ppp * 0.36 + totalPiecesWithoutPacket * 0.36;

    return area.toFixed(2);
  }
  if (size === "30x60") {
    const area = totalPackets * ppp * 0.18 + totalPiecesWithoutPacket * 0.18;

    return area.toFixed(2);
  }
  if (size === "30x30") {
    const area = totalPackets * ppp * 0.09 + totalPiecesWithoutPacket * 0.09;

    return area.toFixed(2);
  }
  if (size === "40x40") {
    const area = totalPackets * ppp * 0.16 + totalPiecesWithoutPacket * 0.16;

    return area.toFixed(2);
  }
  return "0.00";
};
