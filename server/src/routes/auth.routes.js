import express from "express";
import {
  checkAuth,
  logout,
  Signin,
  Signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRout } from "../middleware/auth.middleware.js";

const routes = express.Router();
routes.post("/signup", Signup);
routes.post("/login", Signin);
routes.post("/logout", logout);
routes.post("/profile", protectRout, updateProfile);
routes.get("/check", protectRout, checkAuth);

export default routes;
