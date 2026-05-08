import connectDB from "@/libs/mongodb";
import Chat from "@/models/Chat";
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
    const { participants } = body;

    const [user1, user2] = participants;

    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: {
        $all: [user1, user2],
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2],
      },
    });

    if (existingChat) {
      return Response.json({
        data: existingChat,
        message: "Chat already exist",
        success: false,
      }, { status: 409 })
    }

    const newChat = new Chat({
      participants: [user1, user2],
    })

    await newChat.save();

    await newChat.populate(
      "participants",
      "name phone"
    );
    await newChat.populate("lastMessage");

    await pusher.trigger(`user-${user1}`, "new-chat", newChat);
    await pusher.trigger(`user-${user2}`, "new-chat", newChat);

    return Response.json({ data: newChat, message: "Chat created successfully", success: true }, { status: 200 })

  } catch (error) {
    console.error("Login Error:", error);
        
    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}