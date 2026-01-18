import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(path.dirname(__filename)));

// Ensure we can resolve modules from backend directory
process.chdir(path.join(__dirname, 'backend'));

const PORT = ENV.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, true);
    }
    
    // Allow Vercel preview and production URLs
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }
    
    // Allow configured CLIENT_URL (Render frontend)
    if (ENV.CLIENT_URL && origin === ENV.CLIENT_URL.replace(/\/$/, "")) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all origins in production for now
  },
  credentials: true,
};

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors(corsOptions));
app.use(cookieParser());

// API Routes (must be before static files and catch-all)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make ready for deployment - serve static files and SPA fallback
if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "frontend", "dist");
  console.log("Production mode - serving frontend from:", frontendDistPath);
  
  // Serve static assets
  app.use(express.static(frontendDistPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (_, res) => {
    const indexPath = path.join(frontendDistPath, "index.html");
    console.log("Attempting to serve:", indexPath);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Error loading application");
      }
    });
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});