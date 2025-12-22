import {Server} from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlware.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
})
io.use(socketAuthMiddleware);

// this is for storing online users 
const usersocketMap = {};

io.on("connection",(socket)=>{
    console.log("A User Connected",socket.user.fullName);

    const userId = socket.userId;
    usersocketMap[userId] = socket.id;
    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers",Object.keys(usersocketMap));
    socket.on("disconnect",()=>{
        console.log(" A User Disconnected",socket.user.fullName);
        delete usersocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(usersocketMap));
    }); 
});
export {io, app, server};