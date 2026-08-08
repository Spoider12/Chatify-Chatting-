import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createGroup, getUserGroups } from "../controllers/group.controller.js";

const router = express.Router();

// Get all groups of logged-in user
router.get("/", protectRoute, getUserGroups);

// Create new group
router.post("/create", protectRoute, createGroup);

export default router;