import mongoose from "mongoose";

const replySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "Please enter a reply for this comment"],
    }
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);

export default Reply;