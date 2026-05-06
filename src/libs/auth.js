import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token) => {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null }
}

export const getTokenFromRequest = (req) => {
  const auth = req.headers.get("authorization");

  if (!auth.startWith("Bearer ")) return null;

  return verifyToken(auth.split(" ")[1]);
}