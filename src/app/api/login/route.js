import crypto from "crypto";
import { readFile, writeFile } from "@/utils/fileDB";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, name } = body;

    if (!phone) {
      return Response.json(
        { error: "Phone is Required", status: 400 },
      );
    }

    const users = readFile("users");
    const token = crypto.randomBytes(32).toString("hex");

    const existingUser = (users || []).find(user => user?.details?.phone === phone);
    
    if (existingUser) {
        existingUser.token = token;
        return Response.json(
            { data: existingUser, status: 200, message: "Welcome Back Login Successfully" },
        );
    }

    const newUser = {
      id: Date.now(),
      details: {
        name,
        phone
      },
      token
    }

    users.push(newUser);

    writeFile("users", users);

    return Response.json(
        { data: newUser, status: 200, message: "New User Added and Login Successfully" },
    );


  } catch (error) {
    console.error("Login Error:", error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}