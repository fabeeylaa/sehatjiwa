import express from "express";
import {
  createChallenge,
  getChallenges,
  joinChallenge,
} from "../controllers/challengeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createChallenge);
router.get("/", verifyToken, getChallenges);
router.post("/:id/join", verifyToken, joinChallenge);

export default router;
