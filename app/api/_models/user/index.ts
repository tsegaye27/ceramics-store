import mongoose from "mongoose";
import { IUser } from "./types";
import userSchema from "./schema";

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
