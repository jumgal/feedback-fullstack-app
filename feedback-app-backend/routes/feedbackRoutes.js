import express from "express";
import { body } from "express-validator";
import {
  createFeedback,
  getUserFeedbacks,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback
} from "../controllers/feedbackController.js";
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
      .withMessage("min 10 max 100 characters"),
  ],
  createFeedback
);

router.put(
  "/:feedbackId",
  protect,
  [
    body("title").not().isEmpty().trim().withMessage("min 4 max 20 characters"),
    body("category")
      .not()
      .isEmpty()
      .withMessage("Please select from category options"),
    body("description")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 10 max 100 characters"),
    body("status")
      .not()
      .isEmpty()
      .withMessage("Please select from status options"),
  ],
  updateFeedback
);

router.get("/me", protect, getUserFeedbacks);
router.get("/", getAllFeedbacks);
router.delete('/:feedbackId', protect, deleteFeedback)

export { router as feedbackRoutes };
