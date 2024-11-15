import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  role: "chis" | "user";
  createdAt: Date;
}
