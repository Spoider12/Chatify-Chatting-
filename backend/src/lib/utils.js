import jwt from "jsonwebtoken"


export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    httpOnly: true, // prevent xss attacks
    // Use "lax" for cross-origin requests (Vercel <-> Render)
    sameSite: "lax",
    // Only mark secure in production (requires HTTPS). Keep false in development.
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};