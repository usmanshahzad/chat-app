import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

export async function POST(req) {
  const body = await req.formData();
  const socketId = body.get("socket_id");
  const channel = body.get("channel_name");
  
  const authResponse = pusher.authorizeChannel(socketId, channel);
  return Response.json(authResponse);
}