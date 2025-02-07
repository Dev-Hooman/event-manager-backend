import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/appconfig.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.auth.jwt_secret);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token." });
  }
};
