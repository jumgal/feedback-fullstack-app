import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["enhancement", "feature", "bug", "ui", "ux"],
    },
    title: {
      type: String,
      required: [true, "Please enter a title of the issue"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description for the the issue"],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["planned", "suggestion", "in-progress", "live"],
      default: "suggestion",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
