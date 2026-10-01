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

    const unreadCount = await Message.countDocuments({
      senderId: userToChatId,
      receiverId: myId,
      isRead: false,
    });

    if (unreadCount > 0) {
      await Message.updateMany(
        { senderId: userToChatId, receiverId: myId, isRead: false },
        { $set: { isRead: true, status: "read" } }
      );

      io.to(userToChatId.toString()).emit("messagesRead", {
        readBy: myId,
        partnerId: userToChatId,
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages || []);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myId = req.user._id;
    const partnerId = req.params.id;

    await Message.updateMany(
      {
        senderId: partnerId,
        receiverId: myId,
        isRead: false,
      },
      { $set: { isRead: true, status: "read" } }
    );

    io.to(partnerId.toString()).emit("messagesRead", {
      readBy: myId,
      partnerId,
    });

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

    const { text, image, audio, audioDuration, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image && !audio) {
      return res.status(400).json({ message: "Text, image, or audio is required." });
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
    if (image && image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    let audioUrl;
    if (audio && audio.startsWith("data:audio")) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(audio, {
          resource_type: "auto",
          folder: "voice_notes",
        });
        audioUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.warn("Cloudinary upload failed for audio, retaining data URL:", uploadError.message);
        audioUrl = audio;
      }
    } else if (audio) {
      audioUrl = audio;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      audio: audioUrl,
      audioDuration: audioDuration || 0,
      replyTo: replyTo || null,
      messageType: "private",
      isRead: false,
      status: "sent",
    });

    io.to(receiverId.toString()).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================
   REACT TO MESSAGE
========================= */
export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.reactions = (message.reactions || []).filter(
      (r) => r.userId.toString() !== userId.toString()
    );

    if (emoji) {
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    const payload = {
      messageId: message._id,
      reactions: message.reactions,
    };

    if (message.receiverId) io.to(message.receiverId.toString()).emit("messageReaction", payload);
    if (message.senderId) io.to(message.senderId.toString()).emit("messageReaction", payload);
    if (message.groupId) io.to(message.groupId.toString()).emit("messageReaction", payload);

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in reactToMessage:", error);
    res.status(500).json({ message: "Failed to react to message" });
  }
};

/* =========================
   DELETE MESSAGE
========================= */
export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    message.text = "This message was deleted";
    message.image = undefined;
    message.audio = undefined;
    message.reactions = [];

    await message.save();

    const payload = { messageId: message._id };
    if (message.receiverId) io.to(message.receiverId.toString()).emit("messageDeleted", payload);
    if (message.senderId) io.to(message.senderId.toString()).emit("messageDeleted", payload);
    if (message.groupId) io.to(message.groupId.toString()).emit("messageDeleted", payload);

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ message: "Failed to delete message" });
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