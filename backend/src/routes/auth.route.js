import express from "express";
import multer from "multer";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Multer setup
//const upload = multer({ dest: "uploads/" });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),  // Accept file upload
  updateProfile
);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
