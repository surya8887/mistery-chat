import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

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
}

const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
);

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
    messages: { type: [messageSchema], default: [] }, 
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as any);
  }
});

const User = models.User || model<IUser>("User", userSchema);
export default User;
