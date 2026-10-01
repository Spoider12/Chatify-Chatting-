import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlware.js";
import Group from "../models/Groups.js";
import Message from "../models/message.js";

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

function getOnlineUserIds() {
  return [...new Set(
    [...io.sockets.sockets.values()]
      .filter((socket) => socket.connected)
      .map((socket) => socket.userId)
  )];
}

io.on("connection",async (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  socket.join(userId.toString());

  //AUTO JOIN USER GROUPS
  try {
    const groups = await  Group.find({ members: userId });

    groups.forEach((group) => {
      socket.join(group._id.toString());
    });

    console.log(`${socket.user.fullName} joined ${groups.length} groups`);
  } catch (error) {
    console.log("Error joining groups:", error.message);
  }

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", getOnlineUserIds());

  //private message socket
   socket.on("sendPrivateMessage", async ({ receiverId, text }) => {
    try {
      const newMessage = await Message.create({
        senderId: userId,
        receiverId,
        text,
        messageType: "private",
      });

      io.to(receiverId.toString()).emit("receivePrivateMessage", newMessage);

      // Also send back to sender
      socket.emit("receivePrivateMessage", newMessage);

    } catch (error) {
      console.log("Private message error:", error.message);
    }
  });

  //group message socket
    socket.on("sendGroupMessage", async ({ groupId, text }) => {
    try {
      const newMessage = await Message.create({
        senderId: userId,
        groupId,
        text,
        messageType: "group",
      });

      // Send to all members in that room
      io.to(groupId).emit("receiveGroupMessage", newMessage);

    } catch (error) {
      console.log("Group message error:", error.message);
    }
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

export { io, app, server };