// import { Schema } from "mongoose";
// import { ICeramics } from "./types";

// export const ceramicsSchema = new Schema<ICeramics>(
//   {
//     size: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       required: true,
//     },
//     manufacturer: {
//       type: String,
//       required: true,
//     },
//     piecesPerPacket: {
//       type: Number,
//       required: true,
//     },
//     code: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     totalArea: {
//       type: Number,
//     },
//     totalPackets: {
//       type: Number,
//       required: true,
//     },
//     totalPiecesWithoutPacket: {
//       type: Number,
//       required: true,
//     },
//     imageUrl: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// ceramicsSchema.index(
//   {
//     code: 1,
//     manufacturer: 1,
//     size: 1,
//   },
//   {
//     unique: true,
//   }
// );
