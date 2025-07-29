import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Extend IUser to include method typing
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isAcceptingMessage?: boolean;
  message?: mongoose.Types.ObjectId;

  // Method declaration
  verifyPassword: (password: string) => Promise<boolean>;
}

// Define schema
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
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isAcceptingMessage: { type: Boolean, default: true },
    message: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);

// Pre-save password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Add instance method to compare passwords
userSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Create and export model
const User = models.User || model<IUser>("User", userSchema);
export default User;
