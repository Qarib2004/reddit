
import express from 'express';
import { getUserFeed } from '../controllers/feedController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserFeed);

export default router;
