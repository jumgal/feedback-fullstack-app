import express from "express";
import { body } from "express-validator";
import { createComment, getAllComments, getFeedbackComments } from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post(
  "/:feedbackId",
  protect,
  [
    body("content")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 10 max 100 characters")
  ],
  createComment
);

router.get('/', getAllComments)
router.get('/:feedbackId', protect, getFeedbackComments)

export { router as commentRoutes };