import mongoose, { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
