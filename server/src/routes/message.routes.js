import express from "express";
import { protectRout } from "../middleware/auth.middleware.js";
import {
  getUser,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.get("/users", protectRout, getUser);
messageRoute.get("/:id", protectRout, getMessages);
messageRoute.post("/send-messages/:id", protectRout, sendMessages);

export default messageRoute;
