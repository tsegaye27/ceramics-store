import mongoose from "mongoose";
import ceramicSchema from "./schema";
import { ICeramic } from "./types";

const Ceramic =
  mongoose.models.Ceramic || mongoose.model<ICeramic>("Ceramic", ceramicSchema);
export default Ceramic;
