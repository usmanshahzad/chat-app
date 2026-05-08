import connectDB from "@/libs/mongodb";
import Message from "@/models/Message";
import { handleError } from "@/utils/errorHandler";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { chat, sender, text, } = body;

    const newMessage = new Message({
      chat,
      sender,
      text,
    })

    await newMessage.save();

    await newMessage.populate("sender", "name phone");

    await pusher.trigger(`chat-${chat}`, "new-message", newMessage);

    return Response.json({ success: true, data: newMessage }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
        
    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}