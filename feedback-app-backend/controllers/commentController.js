import { validationResult } from "express-validator";
import { BadRequest } from "../errors/general-error.js";
import Comment from "../models/commentModel.js";
import Feedback from "../models/feedbackModel.js";
import User from "../models/userModel.js";

export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { feedbackId } = req.params;
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest("Please provide valid comment info");
    }

    if (!content) {
      res.status(400);
      throw new BadRequest("Please fill in all comment fields");
    }

    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      res.status(400);
      throw new Error("You need to have a feedback to comment");
    }

    const comment = await Comment.create({
      content,
      user: user._id,
    });

    feedback.comments.push(comment);
    await feedback.save();

    if (comment) {
      res.status(201);
      res.json(comment);
    } else {
      res.status("400");
      throw new Error("Error occurred while creating this comment");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({});

    if (!comments) {
      res.status(400);
      throw new Error("no comments in db");
    }
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getFeedbackComments = async (req, res, next) => {
  console.log(req.params);

  try {
    if (!req.params?.feedbackId) {
      res.status(400);
      throw new Error("Feedback id needs to be provided!");
    }
    const feedback = await Feedback.findById(req.params.feedbackId).populate(
      "comments"
    );
    console.log(feedback);
    if (!feedback) {
      res.status(400);
      throw new Error("No feedback. so no comments");
    }

    res.status(200);
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};
