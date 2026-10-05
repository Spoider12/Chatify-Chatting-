import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  markMessagesRead,
  sendMessage,
  reactToMessage,
  deleteMessage,
  getGroupMessages,
  sendGroupMessage,
} from "../controllers/message.controller.js";
import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Make /contacts public (no auth required)
router.get("/contacts", protectRoute, getAllContacts);

// Protect the chat-related routes
router.get("/chats", protectRoute, getChatPartners);
router.patch("/read/:id", protectRoute, markMessagesRead);
router.get("/group/:groupId", protectRoute, getGroupMessages);
router.post("/send-group/:groupId", protectRoute, sendGroupMessage);
router.get("/:id", protectRoute, getMessagesByUserId);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/:id/react", protectRoute, reactToMessage);
router.delete("/:id", protectRoute, deleteMessage);

export default router;