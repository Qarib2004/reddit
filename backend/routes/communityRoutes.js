import express from 'express';
import { approveJoinRequest, createCommunity, deleteCommunity, getCommunities, getCommunity, getJoinRequests, joinCommunity, leaveCommunity, rejectJoinRequest, requestToJoinCommunity, updateCommunity, uploadCommunityImage } from '../controllers/communityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import upload from '../middlewares/uploadMiddleware.js';
import upload1 from '../middlewares/uploadMiddleware1.js';

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

router.delete("/:id", authMiddleware, deleteCommunity);

router.post(
  "/:id/upload",
  authMiddleware,
  upload1.fields([{ name: "avatar" }, { name: "banner" }]),
  uploadCommunityImage
);

router.post('/:id/join', authMiddleware, joinCommunity);
router.post("/:id/leave", authMiddleware, leaveCommunity);
router.post("/:id/requests", authMiddleware, requestToJoinCommunity);
router.put("/:id", authMiddleware, updateCommunity);
router.get("/:communityId/requests", authMiddleware, getJoinRequests);
router.post("/:communityId/approve/:userId", authMiddleware, approveJoinRequest);
router.post("/:communityId/reject/:userId", authMiddleware, rejectJoinRequest);


export default router;
