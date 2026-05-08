import connectDB from "@/libs/mongodb";
import User from "@/models/User";

export async function GET(request, context) {
  await connectDB();
  const { params } = context;
  const { id } = await params;

  const user = await User.findById(id);

  return Response.json({ data: user || {}, message: "Ok" },);
}