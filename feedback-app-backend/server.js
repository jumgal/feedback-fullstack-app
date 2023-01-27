import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
