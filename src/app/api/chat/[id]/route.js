import connectDB from "@/libs/mongodb";
import Chat from "@/models/Chat";
import { handleError } from "@/utils/errorHandler";
import mongoose from "mongoose";
import User from "@/models/User";
import Message from "@/models/Message";

export async function GET(request, context) {
  try {
    await connectDB();
    const { params } = context;
    const { id } = await params;

    const chats = await Chat.find({
      participants: new mongoose.Types.ObjectId(id)
    })
    .populate("participants", "name phone")
    .populate("lastMessage");

    if (chats.length === 0) {
      return Response.json({ data: [], message: "No Record Found!", success: false }, { status: 200 });
    }

    return Response.json({ data: chats, message: "Ok", success: true }, { status: 200 })
  } catch (error) {
    console.error("Login Error:", error);
        
    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}