import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats", // "chats", "contacts", "groups"
  chatFilter: "all", // "all", "unread", "groups"
  searchQuery: "",
  selectedUser: null,
  selectedGroup: null,
  replyToMessage: null,
  activeDrawer: null, // null, "profile", "settings", "status", "createGroup"
  typingUsers: {}, // { [userId]: boolean }
  isUsersLoading: false,
  isMessagesLoading: false,

  theme: localStorage.getItem("waTheme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("waTheme", theme);
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("waTheme", nextTheme);
    set({ theme: nextTheme });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setChatFilter: (filter) => set({ chatFilter: filter }),
  setReplyToMessage: (msg) => set({ replyToMessage: msg }),
  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),

  // Group selector
  setSelectedGroup: (group) => {
    set({
      selectedGroup: group,
      selectedUser: null,
      replyToMessage: null,
    });
    if (group?._id) {
      get().getGroupMessages(group._id);
    }
  },

  // User selector
  setSelectedUser: (user) =>
    set({
      selectedUser: user,
      selectedGroup: null,
      replyToMessage: null,
    }),

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) ?? true,

  toggleSound: () => {
    const current = get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", !current);
    set({ isSoundEnabled: !current });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  // ================= API CALLS =================

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser) return;

    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unauthorized");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => ({
        messages: res.data,
        chats: state.chats.map((chat) =>
          chat._id === userId ? { ...chat, unreadCount: 0 } : chat
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  markMessagesRead: async (userId) => {
    try {
      await axiosInstance.patch(`/messages/read/${userId}`);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === userId ? { ...chat, unreadCount: 0 } : chat
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark messages read");
    }
  },

  sendTypingSignal: (isTyping) => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser, selectedGroup } = get();
    if (!socket) return;

    if (selectedUser) {
      socket.emit(isTyping ? "typing" : "stopTyping", {
        receiverId: selectedUser._id,
      });
    } else if (selectedGroup) {
      socket.emit(isTyping ? "typing" : "stopTyping", {
        groupId: selectedGroup._id,
      });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedGroup, messages, replyToMessage } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser && !selectedGroup) return;

    const tempId = `temp-${Date.now()}`;
    const payload = {
      ...messageData,
      replyTo: replyToMessage
        ? {
            _id: replyToMessage._id,
            text: replyToMessage.text || (replyToMessage.audio ? "Voice message" : "Photo"),
            senderName:
              replyToMessage.senderId === authUser._id
                ? "You"
                : typeof replyToMessage.senderId === "object"
                ? replyToMessage.senderId.fullName
                : selectedUser?.fullName || "Member",
            image: replyToMessage.image,
            audio: replyToMessage.audio,
          }
        : null,
    };

    const optimisticMessage = {
      _id: tempId,
      senderId: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      receiverId: selectedUser ? selectedUser._id : null,
      groupId: selectedGroup ? selectedGroup._id : null,
      text: payload.text || "",
      image: payload.image,
      audio: payload.audio,
      audioDuration: payload.audioDuration || 0,
      replyTo: payload.replyTo,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      status: "sent",
    };

    set({
      messages: [...messages, optimisticMessage],
      replyToMessage: null,
    });

    if (selectedUser) {
      set((state) => ({
        chats: [
          { ...selectedUser, lastMessage: optimisticMessage },
          ...state.chats.filter((chat) => chat._id !== selectedUser._id),
        ],
      }));
    }

    try {
      const endpoint = selectedGroup
        ? `/messages/send-group/${selectedGroup._id}`
        : `/messages/send/${selectedUser._id}`;

      const res = await axiosInstance.post(endpoint, payload);

      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
      });

      if (selectedUser) {
        set({
          chats: get().chats.map((chat) =>
            chat._id === selectedUser._id
              ? { ...chat, lastMessage: res.data }
              : chat
          ),
        });
      }
    } catch (error) {
      set({ messages });
      toast.error(error.response?.data?.message || "Send failed");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    const { authUser } = useAuthStore.getState();
    try {
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (msg._id === messageId) {
            const filtered = (msg.reactions || []).filter(
              (r) => r.userId !== authUser._id
            );
            const newReactions = emoji
              ? [...filtered, { userId: authUser._id, emoji }]
              : filtered;
            return { ...msg, reactions: newReactions };
          }
          return msg;
        }),
      }));

      await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
    } catch (error) {
      console.error("Failed reaction:", error);
    }
  },

  deleteMessage: async (messageId) => {
    try {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, text: "This message was deleted", image: null, audio: null, reactions: [] }
            : msg
        ),
      }));

      await axiosInstance.delete(`/messages/${messageId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, isSoundEnabled, allContacts, chats } = get();
      const { authUser } = useAuthStore.getState();
      const senderId = newMessage.senderId.toString();
      const currentUserId = authUser?._id?.toString();
      const partnerId =
        senderId === currentUserId
          ? newMessage.receiverId.toString()
          : senderId;
      const partner =
        chats.find((chat) => chat._id.toString() === partnerId) ||
        allContacts.find((contact) => contact._id.toString() === partnerId);

      const isConversationOpen = selectedUser?._id.toString() === partnerId;
      const isIncoming = senderId !== currentUserId;

      if (isConversationOpen) {
        set((state) => ({
          messages: state.messages.some((m) => m._id === newMessage._id)
            ? state.messages
            : [...state.messages, newMessage],
        }));
        if (isIncoming) get().markMessagesRead(partnerId);
      }

      if (partner) {
        set((state) => ({
          chats: [
            {
              ...partner,
              lastMessage: newMessage,
              unreadCount:
                isIncoming && !isConversationOpen
                  ? (partner.unreadCount || 0) + 1
                  : partner.unreadCount || 0,
            },
            ...state.chats.filter((chat) => chat._id.toString() !== partnerId),
          ],
        }));
      } else {
        get().getMyChatPartners();
      }

      if (isIncoming) {
        const preview =
          newMessage.text ||
          (newMessage.image ? "📷 Photo" : newMessage.audio ? "🎤 Voice message" : "New message");
        toast(`${partner?.fullName || "New message"}: ${preview}`, {
          duration: 4000,
        });
      }

      if (isSoundEnabled && isIncoming) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    });

    socket.on("userTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [senderId]: true },
      }));
    });

    socket.on("userStopTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [senderId]: false },
      }));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        ),
      }));
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, text: "This message was deleted", image: null, audio: null, reactions: [] }
            : msg
        ),
      }));
    });

    socket.on("messagesRead", ({ readBy }) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.senderId === readBy || msg.receiverId === readBy
            ? { ...msg, isRead: true, status: "read" }
            : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
    socket.off("messageReaction");
    socket.off("messageDeleted");
    socket.off("messagesRead");
  },
}));