import express from 'express';
import { createCommunity, getCommunities, getCommunity, joinCommunity } from '../controllers/communityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();


router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Название сообщества обязательно'),
    body('description').notEmpty().withMessage('Описание обязательно')
  ],
  createCommunity
);


router.get('/', getCommunities);


router.get('/:id', getCommunity);


router.post('/:id/join', authMiddleware, joinCommunity);

export default router;
