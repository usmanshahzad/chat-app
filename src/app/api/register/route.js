import connectDB from "@/libs/mongodb";
import User from "@/models/User";
import { handleError } from "@/utils/errorHandler";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, password } = body;

    const newUser = new User({
      name,
      phone,
      password,
      currentActivePlan: {
        planId: 1,
        planName: "Free",
        planPrice: 0,
      },
      lastLogin: new Date(),
    });

    await newUser.save();

    return Response.json({ message: "User Created Successfully", status: 200 })


  } catch (error) {
    console.error("Login Error:", error);

    const { status, body } = handleError(error);

    return Response.json(body, { status });
  }
}