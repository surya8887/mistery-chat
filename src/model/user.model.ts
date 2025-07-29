import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// ====================
// Interfaces
// ====================
export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isAcceptingMessage?: boolean;
  messages?: IMessage[];
  verifyPassword(password: string): Promise<boolean>;
}

// ====================
// Message Schema (Subdocument)
// ====================
const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
);

// ====================
// User Schema
// ====================
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isAcceptingMessage: { type: Boolean, default: true },
    messages: { type: [messageSchema], default: [] }, // Embedded messages
  },
  {
    timestamps: true,
  }
);

// ====================
// Pre-save password hashing
// ====================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as any);
  }
});

// ====================
// Password verification method
// ====================
userSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// ====================
// Model Export
// ====================
const User = models.User || model<IUser>("User", userSchema);
export default User;
