import mongoose from "mongoose";
import { ICeramics } from "./types";
import { ceramicsSchema } from "./schema";
import * as Statics from "./statics";

ceramicsSchema.static(Statics);

const Ceramics = mongoose.model<ICeramics>("Ceramics", ceramicsSchema);

export default Ceramics;
