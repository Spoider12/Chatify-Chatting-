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
const __dirname = path.dirname(path.dirname(__filename));

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// API Routes (must be before static files and catch-all)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make ready for deployment - serve static files and SPA fallback
if (ENV.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "frontend", "dist");
  
  // Serve static assets
  app.use(express.static(frontendDistPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) {
        res.status(500).send("Error loading application");
      }
    });
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});