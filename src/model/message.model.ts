import mongoose, { Schema, model, models, Document } from "mongoose";

// Define the TypeScript interface
export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

// Define the schema with types
const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model or reuse existing
const Message = models.Message || model<IMessage>("Message", messageSchema);

export default Message;
