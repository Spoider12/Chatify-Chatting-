import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ✅ Group selector
  setSelectedGroup: (group) =>
    set({
      selectedGroup: group,
      selectedUser: null, // clear personal chat
    }),

  // ✅ User selector
  setSelectedUser: (user) =>
    set({
      selectedUser: user,
      selectedGroup: null, // clear group chat
    }),

  isSoundEnabled:
    JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // optimistic update
    set({ messages: [...messages, optimisticMessage] });

    set((state) => ({
      chats: [
        { ...selectedUser, lastMessage: optimisticMessage },
        ...state.chats.filter((chat) => chat._id !== selectedUser._id),
      ],
    }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // replace optimistic message
      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
        chats: get().chats.map((chat) =>
          chat._id === selectedUser._id
            ? { ...chat, lastMessage: res.data }
            : chat
        ),
      });
    } catch (error) {
      // rollback
      set({ messages });
      toast.error(error.response?.data?.message || "Send failed");
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
      const partnerId = senderId === currentUserId
        ? newMessage.receiverId.toString()
        : senderId;
      const partner = chats.find((chat) => chat._id.toString() === partnerId)
        || allContacts.find((contact) => contact._id.toString() === partnerId);

      const isConversationOpen = selectedUser?._id.toString() === partnerId;
      const isIncoming = senderId !== currentUserId;

      if (isConversationOpen) {
        set((state) => ({
          messages: state.messages.some((message) => message._id === newMessage._id)
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
              unreadCount: isIncoming && !isConversationOpen
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
        const preview = newMessage.text || (newMessage.image ? "Sent a photo" : "New message");
        toast(`${partner?.fullName || "New message"}: ${preview}`, {
          duration: 5000,
        });
      }

      if (isSoundEnabled && isIncoming) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
}));