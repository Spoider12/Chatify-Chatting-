import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";  
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
dotenv.config();
import {ENV} from "./lib/env.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import bodyParser from "body-parser";
import { app, server } from "./lib/socket.js";


const __dirname = path.resolve();

const PORT = process.env.PORT || 4000;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(_,res )=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  });

};
server.listen(PORT, () => {
    console.log("Server is running on port:"+PORT)
    connectDB();
}); 