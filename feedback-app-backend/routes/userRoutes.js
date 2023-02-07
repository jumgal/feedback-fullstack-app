import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getAllUsers } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();
// import {registerUser, loginUser, getMe} from '../controllers/userController.js'


router.post(
  "/",
  [
    body("registerName")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 4 max 20 characters"),
    body("registerUsername")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 4 max 20 characters"),
    body("registerEmail")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide valid email"),
    body("registerPassword")
      .not()
      .isEmpty()
      .trim()
      .withMessage("min 4 max 20 characters"),
    body("registerImage")
      .isLength({ min: 4, max: 50 })
      .withMessage("min 4 max 50 characters")
      .optional({ checkFalsy: true }),
  ],
  registerUser
);

router.post(
  "/login",
  body("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("min 4 max 20 characters"),
  body("password2")
    .not()
    .isEmpty()
    .trim()
    .withMessage("min 4 max 20 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide valid email"),
  loginUser
);

router.get('/', protect, getAllUsers)
// router.post('/login', loginUser)

// router.get('/me', protect, getMe)

export { router as userRoutes };
