import mongoose, { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
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
  },
  { timestamps: true }
);

const User = mongoose.models.User || model<IUser>("User", userSchema);

export default User;
export type { IUser };
