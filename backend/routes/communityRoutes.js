import express from 'express';
import { approveJoinRequest, createCommunity, getCommunities, getCommunity, getJoinRequests, joinCommunity, leaveCommunity, rejectJoinRequest, requestToJoinCommunity, updateCommunity } from '../controllers/communityController.js';
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
router.post("/:id/requests", authMiddleware, requestToJoinCommunity);
router.put("/:id", authMiddleware, updateCommunity);
router.get("/:communityId/requests", authMiddleware, getJoinRequests);
router.post("/:communityId/approve/:userId", authMiddleware, approveJoinRequest);
router.post("/:communityId/reject/:userId", authMiddleware, rejectJoinRequest);


export default router;
