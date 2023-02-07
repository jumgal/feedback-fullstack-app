import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "Please enter a comment"],
    },
    replies: [
      {type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply'
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;