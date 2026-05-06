import crypto from "crypto";
import { readFile, writeFile } from "@/utils/fileDB";
import connectDB from "@/libs/mongodb";
import User from "@/models/User";
import { handleError } from "@/utils/errorHandler";
import { signToken } from "@/libs/auth";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { phone, password } = body;

    const user = await User.findOne({ phone, isActive: true });

    if (!user || !(await user.comparePassword(password))) {
      return Response.json({ error: "Invalid credentials", }, { status: 401 });
    }

    user.lastLogin = new Date();

    await user.save();

    const token = signToken({ id: user._id, name: user.name, phone: user.phone });

    return Response.json({
      data: {
        token,
        user: { id: user._id, name: user.name, phone: user.phone },
      },
      status: 200,
      message: "Welcome Back Login Successful"
    })


  } catch (error) {
    console.error("Login Error:", error);
    
    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}