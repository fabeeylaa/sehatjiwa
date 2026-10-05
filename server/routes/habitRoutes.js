import express from "express";
import {
  createHabit,
  getHabits,
  getWeeklyStats,
  getHabitById,
  updateHabit,
  deleteHabit,
  logHabit,
  unlogHabit,
  getHabitLogs,
} from "../controllers/habitController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/weekly", verifyToken, getWeeklyStats);
router.post("/", verifyToken, createHabit);
router.get("/", verifyToken, getHabits);
router.get("/:id", verifyToken, getHabitById);
router.put("/:id", verifyToken, updateHabit);
router.delete("/:id", verifyToken, deleteHabit);
router.post("/:id/log", verifyToken, logHabit);
router.delete("/:id/log", verifyToken, unlogHabit);
router.get("/:id/logs", verifyToken, getHabitLogs);

export default router;