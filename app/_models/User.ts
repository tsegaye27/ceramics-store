import mongoose, { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  role: "chis" | "user";
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
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

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
export type { IUser };
