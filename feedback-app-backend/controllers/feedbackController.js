import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { BadRequest } from "../errors/general-error.js";
import Comment from "../models/commentModel.js";
import Feedback from "../models/feedbackModel.js";
import Reply from "../models/replyModel.js";
import User from "../models/userModel.js";

export const createFeedback = async (req, res, next) => {
  try {
    const { title, category, description, upvotes, status } = req.body;
    const user = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest(
        "Please fill in all fields and provide valid Feedback information."
      );
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
      status,
    });

    if (feedback) {
      res.status(201).json({
        _id: feedback._id,
        title: feedback.title,
        category: feedback.category,
        description: feedback.description,
        user: feedback.user,
        status: feedback.status,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { title, category, description, status, id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest(
        "Please fill in all fields and provide valid Feedback information."
      );
    }

    if (!title && !category && !description && !status) {
      res.status(400);
      throw new BadRequest(
        "You need to change at least one field to update a feedback"
      );
    }

    const existingFeedback = await Feedback.findOne({ _id: id });

    if (!existingFeedback) {
      res.status(400);
      throw new Error(
        "We couldn'd find this feedback. Please provide valid Feedback ID"
      );
    }

    if (existingFeedback.title !== title) {
      existingFeedback.title = title;
    }

    if (existingFeedback.category !== category) {
      existingFeedback.category = category;
    }

    if (existingFeedback.status !== status) {
      existingFeedback.status = status;
    }

    if (existingFeedback.description !== description) {
      existingFeedback.description = description;
    }

    await existingFeedback.save();

    res.status(201).json(existingFeedback);
  } catch (error) {
    console.log("update error ", error);
    next(error);
  }
};

export const getUserFeedbacks = async (req, res, next) => {
  const user = req.user;
  try {
    const feedbacks = await Feedback.find({ user }).populate(
      "comments",
      "content"
    );
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
    const feedbacks = await Feedback.find({});
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

export const deleteFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params || {};

    if (!feedbackId) {
      throw new BadRequest("Please provide Feedback ID to delete a feedback");
    }

    const feedback = await Feedback.findOne({ _id: feedbackId });

    if (!feedback) {
      res.status(400);
      throw new BadRequest("There isn't a feedback with " + feedbackId);
    }

    if (!feedback?.user.equals(req?.user._id)) {
      res.status(401);
      throw new BadRequest("You can only delete your own Feedbacks");
    }

    const feedbackComments = feedback.comments;
    if (feedbackComments.length > 0) {
      for (let comm of feedbackComments) {
        await Comment.deleteOne({ _id: comm._id });
      }
    }

    const { deletedCount } = await Feedback.deleteOne({ _id: feedbackId });
    if (deletedCount > 0) {
      res.json({ deleted: true });
    } else {
      throw new Error('deletion is failed')
    }
  } catch (error) {
    next(error);
  }
};
