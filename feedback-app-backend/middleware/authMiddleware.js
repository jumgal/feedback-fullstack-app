import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Unauthorized User");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Unauthorized User");
    }
  } catch (error) {
    console.log("error auth middle ", error);
    next(error);
  }
};

export default protect;