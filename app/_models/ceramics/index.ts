import mongoose, { Model } from "mongoose";
import { ICeramics, ICeramicsModel } from "./types";
import { ceramicsSchema } from "./schema";
import * as Statics from "./statics";

ceramicsSchema.static(Statics);

const Ceramics =
  (mongoose.models.Ceramics as unknown as ICeramicsModel) ||
  mongoose.model<ICeramics, ICeramicsModel>("Ceramics", ceramicsSchema);

export default Ceramics;
