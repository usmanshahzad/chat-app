import User from "@/models/User";
import { readFile } from "@/utils/fileDB";


export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  const user = await User.findById(id);

  return Response.json(user || {});
}