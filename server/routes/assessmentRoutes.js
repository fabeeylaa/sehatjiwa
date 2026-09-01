import express from "express";
import {
  getAssessments,
  getAssessmentDetail,
  submitAssessment,
  getAssessmentHistory,
} from "../controllers/assessmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAssessments);
router.get("/history", verifyToken, getAssessmentHistory);
router.get("/:id", verifyToken, getAssessmentDetail);
router.post("/:id/submit", verifyToken, submitAssessment);

export default router;