// server.js packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routes
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
// db
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config(); // load .env file

// express app

// port
const PORT = process.env.PORT || 5000;
// middleware
app.use(express.json());
app.use(cookieParser());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
// listen
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
