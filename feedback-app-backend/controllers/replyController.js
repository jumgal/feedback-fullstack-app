import { validationResult } from "express-validator";
import { BadRequest } from "../errors/general-error.js";
import Comment from "../models/commentModel.js";
import Feedback from "../models/feedbackModel.js";
import Reply from "../models/replyModel.js";
import User from "../models/userModel.js";

export const createReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    const {commentId } = req.params;
    const user = req.user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new BadRequest("Please provide valid reply");
    }

    if (!content) {
      res.status(400);
      throw new BadRequest("Please provide content for your reply");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(400);
      throw new Error(
        "You need to have comment to reply"
      );
    }

    const reply = await Reply.create({
      content,
      user,
    });

    comment.replies.push(reply);
    await comment.save();

    if (reply) {
      res.status(201);
      res.json(reply);
    } else {
      res.status("400");
      throw new Error("Error occurred while creating your reply");
    }
  } catch (error) {
    console.log('error ', error)
    next(error);
  }
};

export const getAllReplies = async (req, res, next) => {
  try {
   
    const replies = await Reply.find({})
     
    if (!replies) {
     res.status(400)
     throw new Error('no replies in db')
    }
    res.json(replies);
  } catch (error) {
    next(error);
  }
};

export const getCommentReplies = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate('replies')
    if (!comment) {
      res.status(400);
      throw new Error("No comment. so no replies");
    }

    res.status(200);
    res.json(comment);
  } catch (error) {
    next(error);
  }
};
