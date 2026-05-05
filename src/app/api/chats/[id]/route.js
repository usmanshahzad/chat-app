import { readFile } from "@/utils/fileDB";

export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  const chats = readFile("chats");
  const filterUserChats = (chats || []).filter((c) => c.participants.some((p) => p.id == id));

  return Response.json(filterUserChats);
}