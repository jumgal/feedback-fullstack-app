import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes.js";
import { feedbackRoutes } from "./routes/feedbackRoutes.js";
import { commentRoutes } from "./routes/commentRoutes.js";
import { replyRoutes } from "./routes/replyRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from 'cors'
import connectDB from "./config/db.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/feedbacks', feedbackRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/replies', replyRoutes)

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
