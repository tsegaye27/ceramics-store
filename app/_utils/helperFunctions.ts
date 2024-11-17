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
) => {
  if (totalPackets < 0 || totalPiecesWithoutPacket < 0) {
    console.log("Invalid Data");
  }
  return;
};
