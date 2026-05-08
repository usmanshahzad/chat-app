import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: [true, "Participants are required"], }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  isGroup: { type: Boolean, default: false },
  groupName: { type: String, trim: true },
  groupAdmin: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true })

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);