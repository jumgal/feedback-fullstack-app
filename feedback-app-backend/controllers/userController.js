import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { BadRequest, NotFound } from "../errors/general-error.js";
import Feedback from "../models/feedbackModel.js";

// @desc    Register a new user
// @route   /api/users
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest("Please fill in all required fields.");
    }

    const {
      registerName,
      registerUsername,
      registerEmail,
      registerPassword,
    } = req.body;

    if (
      !registerName ||
      !registerUsername ||
      !registerEmail ||
      !registerPassword
    ) {
      res.status(400);
      throw new BadRequest("Please include all required fields");
    }

    const userExists = await User.findOne({ email: registerEmail });

    if (userExists) {
      res.status(400);
      throw new BadRequest("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerPassword, salt);

    const user = await User.create({
      name: registerName,
      username: registerUsername,
      email: registerEmail,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        admin: user.admin,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password, password2 } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest("Please fill in all required login fields.");
    }

    if (password !== password2) {
      res.status(400);
      throw new BadRequest("Passwords do not match. Please try again");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new BadRequest("Invalid Credentials");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    if (users) {
      res.status(200);
      res.json(users);
    } else {
      res.status(400);
      throw new BadRequest("No users found. Please register users");
    }
  } catch (error) {
    next(error);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
