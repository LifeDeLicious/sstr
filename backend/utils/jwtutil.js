import jwt from "jsonwebtoken";

const JWT_SECRET = "my-jwt_-secret-key";
const JWT_EXPIRY = "21d";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.UserID,
      username: user.Username,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
