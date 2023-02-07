import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { BadRequest } from "../errors/general-error.js";
import Feedback from "../models/feedbackModel.js";
import User from "../models/userModel.js";

export const createFeedback = async (req, res, next) => {
  try {
    console.log("req body ", req.body);
    const { title, category, description, upvotes, status} = req.body;
    const user = req.user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest("Please provide valid info");
    }

    if (!title || !category || !description) {
      res.status(400);
      throw new BadRequest("Please fill in all required fields");
    }

    const feedback = await Feedback.create({
      title,
      category,
      description,
      upvotes,
      user,
      status
    })

    if (feedback) {
      res.status(201).json({
        _id: feedback._id,
        title: feedback.title,
        category: feedback.category,
        description: feedback.description,
        user: feedback.user,
        status: feedback.status
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserFeedbacks = async (req, res, next) => {
 const user = req.user
  try {
    const feedbacks = await Feedback.find({user}).populate('comments', 'content')
    console.log("feedbacks of John ", feedbacks);
    if (feedbacks) {
      res.status(200).json(feedbacks);
    } else {
      res.status(400);
      throw new BadRequest("No feeedback found. Please add some!");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({})
    console.log("all feedbacks", feedbacks);
    if (feedbacks) {
      res.status(200).json(feedbacks);
    } else {
      res.status(400);
      throw new BadRequest("No feeedback found. Please add some!");
    }
  } catch (error) {
    next(error);
  }
}
