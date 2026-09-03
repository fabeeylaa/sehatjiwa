import express from "express";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../controllers/bookmarkController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getBookmarks);
router.post("/", verifyToken, addBookmark);
router.delete("/:articleId", verifyToken, removeBookmark);

export default router;
