import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.post("/messages", authMiddleware, getMessages);

export default router;
