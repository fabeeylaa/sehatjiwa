import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getLeaderboard);

export default router;
