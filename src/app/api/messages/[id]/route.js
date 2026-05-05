import { readFile } from "@/utils/fileDB";


export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  const messages = readFile("messages");

  return Response.json(messages[id] || []);
}