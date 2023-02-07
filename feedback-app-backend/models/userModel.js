import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      isRequired: true,
    },
    username: {
      type: String,
      isRequired: true,
    },
    email: {
      type: String,
      isRequired: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      isRequired: true
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
