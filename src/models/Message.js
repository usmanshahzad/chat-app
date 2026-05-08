import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: [true, "Chat is required"] },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Sender is required"] },
  text: { type: String, required:[true, "Message text is required"] },
  messageType: { type: String, enum: ["text", "image", "file"], default: "text" },
  seenBy: [{ type: Schema.Types.ObjectId, ref: "User",  }],
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);