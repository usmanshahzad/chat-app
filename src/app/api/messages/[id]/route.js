import connectDB from "@/libs/mongodb";
import Message from "@/models/Message";
import { handleError } from "@/utils/errorHandler";

export async function GET(request, context) {
  try {
    await connectDB();
    const { params } = context;
    const { id } = await params;

    const messages = await Message.find({ chat: id })
    .populate("sender", "name phone");

    return Response.json({ data: messages, message: "Messages fetched successfully", success: true }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
        
    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}