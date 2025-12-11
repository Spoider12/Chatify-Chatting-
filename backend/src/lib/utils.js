import jwt from "jsonwebtoken"


export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    httpOnly: true, // prevent xss attacks
    // In development we allow a more permissive SameSite so the cookie works with dev setups
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    // Only mark secure in production (requires HTTPS). Keep false in development.
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};