import express from "express";
import { body } from "express-validator";
import { createFeedback, getUserFeedbacks, getAllFeedbacks } from "../controllers/feedbackController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("title").not().isEmpty().trim().withMessage("min 4 max 20 characters"),
    body("category").not().isEmpty().withMessage("Please select from options"),
    body("description")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 10 max 100 characters")
  ],
  createFeedback
);

router.get('/me', protect, getUserFeedbacks )
router.get('/', getAllFeedbacks)

export { router as feedbackRoutes };
