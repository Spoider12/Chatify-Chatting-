import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  markMessagesRead,
  sendMessage,
  reactToMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Make /contacts public (no auth required)
router.get("/contacts", protectRoute, getAllContacts);

// Protect the chat-related routes
router.get("/chats", protectRoute, getChatPartners);
router.patch("/read/:id", protectRoute, markMessagesRead);
router.get("/:id", protectRoute, getMessagesByUserId);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/:id/react", protectRoute, reactToMessage);
router.delete("/:id", protectRoute, deleteMessage);

export default router;