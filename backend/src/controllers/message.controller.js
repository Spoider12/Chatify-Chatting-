import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import { io } from "../lib/socket.js";

/* =========================
   GET ALL CONTACTS
========================= */
export const getAllContacts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET MESSAGES BY USER ID
========================= */
export const getMessagesByUserId = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // sorted properly

    res.status(200).json(messages || []);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({
      error:error.message,
     });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Message.updateMany(
      {
        senderId: req.params.id,
        receiverId: req.user._id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error.message);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    if (senderId.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      messageType: "private",
      isRead: false,
    });

    io.to(receiverId.toString()).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================
   GET CHAT PARTNERS
========================= */
export const getChatPartners = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId },
      ],
    }).sort({ createdAt: -1 });

    const latestMessageByPartner = new Map();
    const unreadCountByPartner = new Map();
    for (const message of messages) {
      const isSender = message.senderId.toString() === loggedInUserId.toString();
      const partnerId = isSender
        ? message.receiverId.toString()
        : message.senderId.toString();

      if (!latestMessageByPartner.has(partnerId)) {
        latestMessageByPartner.set(partnerId, message);
      }
      if (!isSender && message.isRead === false) {
        unreadCountByPartner.set(
          partnerId,
          (unreadCountByPartner.get(partnerId) || 0) + 1
        );
      }
    }

    const chatPartnerIds = [...latestMessageByPartner.keys()];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    const chats = chatPartners
      .map((partner) => {
        const partnerId = partner._id.toString();
        return {
          ...partner.toObject(),
          lastMessage: latestMessageByPartner.get(partnerId),
          unreadCount: unreadCountByPartner.get(partnerId) || 0,
        };
      })
      .sort(
        (first, second) =>
          new Date(second.lastMessage.createdAt) -
          new Date(first.lastMessage.createdAt)
      );

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChatPartners:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};