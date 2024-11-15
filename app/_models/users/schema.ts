import { Schema } from "mongoose";
import { IUser } from "./types";

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["chis", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);
