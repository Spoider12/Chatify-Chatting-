import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast"
import { useAuthStore } from "./useAuthStore";
import { text } from "framer-motion/client";
export const useChatStore = create((set,get)=>({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    setSelectedUser: (user) => set({ selectedUser: user }),

    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled:  JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
   toggleSound:()=>{
    localStorage.setItem("isSoundEnabled",!get().isSoundEnabled)
    set({isSoundEnabled:!get().isSoundEnabled})
   },
   setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),
    getAllContacts: async()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/messages/contacts")
            set({allContacts:res.data});

        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to load contacts"
            toast.error(msg)
            console.log("Error fetching contacts:", error);
        }
        finally{
            set({isUsersLoading:false});
        }
    },
    getMyChatPartners: async()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/messages/chats")
            set({chats:res.data});

        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to load chats"
            toast.error(msg)
            console.log("Error fetching chat partners:", error);
        }
        finally{
            set({isUsersLoading:false});
        }
    },
   getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) =>{
    const {selectedUser,messages} = get();
    const {authUser} = useAuthStore.getState(); 
    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
        _id: tempId,
        senderId: authUser._id,
        receiverId: selectedUser._id,
        text: messageData.text,
        image: messageData.image,
        createdat: new Date().toLocaleString(),
        isOptimistic:true,
    };
       set ({messages: [...messages,optimisticMessage]});
     try {
        const res  = await axiosInstance.post (`/messages/send/${selectedUser._id}`,messageData)
        set({messages:messages.concat (res.data)});
     } catch (error) {
      // Remove the optimistic message on failure
      set ({messages: messages})
        toast.error(error.response?.data?.message || "Something went wrong");
     }
  }
})); 
 