  import {create} from "zustand";
  import {axiosInstance} from "../lib/axios"
  import { toast } from "react-hot-toast"
  import {io} from "socket.io-client"

  const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : (import.meta.env.VITE_SOCKET_URL || "/");

  export const useAuthStore = create(( set, get)=>({
   authUser:null,
    onlineUsers: [],  // <-- FIX: always an array
  setOnlineUsers: (users) => set({ onlineUsers: users }),
   isCheckingAuth:true,
   isSignUp:false,
   isLoggingIn:false,
   socket : null,
   onlineUsers:[],
   checkAuth: async()=>{
    try {
      const res = await axiosInstance.get("/auth/check")
      console.log(" RESDATA",res.data);
      
      set({authUser:res.data})
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:",error);
      set({authUser:null})
      
    }finally{
      set({isCheckingAuth:false})
    }
   },
   signup: async(data)=>{
    set({isSignUp:true})
    try {
      const res = await axiosInstance.post("/auth/signup",data)
      set({authUser:res.data});
      toast.success("Account created successfully")
      get().connectSocket();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Signup failed"
      toast.error(msg)
    }
    finally{
      set({isSignUp:false})
    }
   },
   login: async(data)=>{
    set({isLoggingIn:true})
    try {
      const res = await axiosInstance.post("/auth/login",data)
      set({authUser:res.data});
      toast.success("logged in successfully")
      get().connectSocket();  //connect to socket after login
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Login failed"
      toast.error(msg)
    }
    finally{
      set({isLoggingIn:false})
    }
   },
   logout: async()=>{
    try {
      await axiosInstance.post("/auth/logout");
      set({authUser:null});
      toast.success("Logged out successfully")
      get().disconnectSocket(); //disconnect socket on logout
    } catch (error) {
      toast.error("error logging out")
      console.log("Logout error:",error);
      
    }
   },
   updateProfile: async(data)=>{
    try {
      const res =  await axiosInstance.put("/auth/update-profile",data)
      set({authUser:res.data});
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },
  connectSocket : () =>{
    const{authUser} = get();
    if(!authUser || get().socket?.connected) return 
    const socket =  io(BASE_URL,{
      withCredentials:true  //this ensures cookies are sent with the connections
    })
    socket.connect();
    set({socket});

    //listen for online users event
    socket.on("getOnlineUsers",(users)=>{
      set({onlineUsers:users});
    });
    
  },
  disconnectSocket:() =>{
     if(get().socket?.connected)get().socket?.disconnect();
  },
   
   
    
    
   
   
  
  
}));