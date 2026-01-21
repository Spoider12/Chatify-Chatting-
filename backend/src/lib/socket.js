import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow localhost for development
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      
      // Allow Vercel preview and production URLs
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }
      
      // Allow configured CLIENT_URL
      if (ENV.CLIENT_URL && origin === ENV.CLIENT_URL.replace(/\/$/, "")) {
        return callback(null, true);
      }
      
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };