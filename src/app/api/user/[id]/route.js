import { readFile } from "@/utils/fileDB";


export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  const users = readFile("users");
  const currentUser = (users || []).find((u) => u.id == id);

  return Response.json(currentUser || {});
}