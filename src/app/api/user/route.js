import connectDB from "@/libs/mongodb";
import User from "@/models/User";

export async function GET(request) {
  await connectDB();
  const users = await User.find({});

  return Response.json({ data: users || [], message: "Ok" });
}