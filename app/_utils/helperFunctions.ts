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
  piecesPerPacket: number,
): { packets: number; pieces: number } => {
  if (totalPiecesWithoutPacket >= piecesPerPacket) {
    totalPackets += Math.floor(totalPiecesWithoutPacket / piecesPerPacket);
    totalPiecesWithoutPacket %= piecesPerPacket;
  }
  return { packets: totalPackets, pieces: totalPiecesWithoutPacket };
};

export const validateInput = (
  totalPackets: number,
  totalPiecesWithoutPacket: number,
): boolean => {
  const isValid = totalPackets >= 0 && totalPiecesWithoutPacket >= 0;
  return isValid;
};

export const checkSufficiency = (
  packetsAvailable: number,
  packetsToSell: number,
  piecesAvailable: number,
  piecesToSell: number,
): boolean => {
  if (packetsAvailable < packetsToSell) {
    return false;
  }
  if (packetsAvailable === packetsToSell && piecesAvailable < piecesToSell) {
    return false;
  }
  return true;
};

export const calculateArea = (
  totalPackets: number,
  totalPiecesWithoutPacket: number,
  piecesPerPacket: number,
  size: string,
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

interface Order {
  packets: number;
  pieces: number;
  price: number;
  ceramicId?: {
    piecesPerPacket?: number;
    size?: string;
  };
}

export const calculateTotalPrice = (orders: Order[]): number => {
  if (!Array.isArray(orders)) {
    return 0;
  }
  return orders.reduce((total, order) => {
    const area = calculateArea(
      order.packets,
      order.pieces,
      order.ceramicId?.piecesPerPacket ?? 0,
      order.ceramicId?.size ?? "",
    );
    return total + order.price * (Number(area) || 0);
  }, 0);
};

export const calculateTotalArea = (orders: Order[]): number => {
  if (!Array.isArray(orders)) {
    return 0;
  }
  return orders.reduce((total, order) => {
    const area = calculateArea(
      order.packets,
      order.pieces,
      order.ceramicId?.piecesPerPacket ?? 0,
      order.ceramicId?.size ?? "",
    );
    return total + (Number(area) || 0);
  }, 0);
};

export const getAreaFactor = (size: string): number => {
  switch (size) {
    case "60x60":
      return 0.36;
    case "40x40":
      return 0.16;
    case "30x60":
      return 0.18;
    case "30x30":
      return 0.09;
    case "zekolo":
      return 0.6;
    default:
      return 1;
  }
};
