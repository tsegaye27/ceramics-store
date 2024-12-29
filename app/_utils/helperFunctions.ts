import logger from "./logger";

export const formatDate = (unformattedDate: string): string => {
  const date = new Date(unformattedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hours = new Date(unformattedDate).getHours();
  const minutes = new Date(unformattedDate).getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${date} at ${formattedHours}:${formattedMinutes} ${period}`;
};

export const formatPieces = (
  totalPackets: number,
  totalPiecesWithoutPacket: number,
  piecesPerPacket: number
): { packets: number; pieces: number } => {
  if (totalPiecesWithoutPacket >= piecesPerPacket) {
    totalPackets += Math.floor(totalPiecesWithoutPacket / piecesPerPacket);
    totalPiecesWithoutPacket %= piecesPerPacket;
  }
  return { packets: totalPackets, pieces: totalPiecesWithoutPacket };
};

export const validateInput = (
  totalPackets: number,
  totalPiecesWithoutPacket: number
): boolean => {
  const isValid = totalPackets >= 0 && totalPiecesWithoutPacket >= 0;
  if (!isValid) logger.warn("Invalid Data: Negative values are not allowed.");
  return isValid;
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
  piecesPerPacket: number,
  size: string
): string => {
  const sizeToAreaFactor: Record<string, number> = {
    "60x60": 0.36,
    "30x60": 0.18,
    "30x30": 0.09,
    "40x40": 0.16,
  };

  const factor = sizeToAreaFactor[size] || 0;
  const totalArea =
    totalPackets * piecesPerPacket * factor + totalPiecesWithoutPacket * factor;
  return totalArea.toFixed(2);
};
