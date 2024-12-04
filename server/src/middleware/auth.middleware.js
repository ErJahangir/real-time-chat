import jwt from "jsonwebtoken";

import User from "../models/auth.model.js";

export const protectRout = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    if (!decoded) {
      return res.status(401).json({ message: "invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
  }
};
