import express from 'express';
import { createCommunity, getCommunities, getCommunity, joinCommunity, leaveCommunity } from '../controllers/communityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();


router.post(
  '/',
  authMiddleware,
  [
    body('name').notEmpty().withMessage('The name of the community is mandatory'),
    body('description').notEmpty().withMessage('The description is mandatory')
  ],
  createCommunity
);


router.get('/', getCommunities);


router.get('/:id', getCommunity);


router.post('/:id/join', authMiddleware, joinCommunity);
router.post("/:id/leave", authMiddleware, leaveCommunity);


export default router;
