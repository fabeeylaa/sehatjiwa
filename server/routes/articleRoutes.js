import express from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

// Admin-only routes
router.post('/admin', verifyToken, isAdmin, createArticle);
router.put('/admin/:id', verifyToken, isAdmin, updateArticle);
router.delete('/admin/:id', verifyToken, isAdmin, deleteArticle);

export default router;