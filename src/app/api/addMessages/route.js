import { readFile, writeFile } from "@/utils/fileDB";
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
    const body = await request.json();

    const { chatId, sender, text, userId } = body;

    const messages = readFile("messages");

    if (!messages[chatId]) {
      messages[chatId] = [];
    }

    const newMessage = {
      id: Date.now(),
      sender,
      text,
      senderId: userId,
    };

    messages[chatId].push(newMessage);

    writeFile("messages", messages);

    await pusher.trigger("chat-room", "new-message", {
      id: Date.now(),
      sender,
      text,
      senderId: userId,
    })

    return Response.json({ status: 200, data: newMessage });
  } catch (error) {
    return Response.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}