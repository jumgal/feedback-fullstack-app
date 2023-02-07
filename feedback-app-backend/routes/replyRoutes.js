import express from "express";
import { body } from "express-validator";
import { createReply, getAllReplies, getCommentReplies} from "../controllers/replyController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post(
  "/:commentId/",
  protect,
  [
    body("content")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 10 max 100 characters")
  ],
  createReply
);

router.get('/', getAllReplies)
router.get('/:commentId', protect, getCommentReplies)

export { router as replyRoutes };