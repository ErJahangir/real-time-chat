import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/auth.routes.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import messageRoute from "./src/routes/message.routes.js";
import { app, server } from "./src/lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", routes);
app.use("/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

connectDB();
server.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);
