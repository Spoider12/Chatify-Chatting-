import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
 
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // in production the frontend may be on a different origin, so allow cross-site cookies
    sameSite: isProd ? "none" : "lax",
    // only send over HTTPS in production
    secure: isProd,
  });

  return token;
};
