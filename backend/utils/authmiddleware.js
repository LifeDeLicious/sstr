import { verifyToken } from "./jwtutil.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Authentication requried" });
  }

  const decoded = verifyToken(token);
  console.log("decoded token", decoded);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expoired token" });
  }

  req.user = decoded;
  next();
};
