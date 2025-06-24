import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(postRoutes);

app.use(express.static("uploads"));

const mongoUrl = process.env.MONGO_URL;

const start = async () => {
  try {
    const connectDB = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 45000,
    });
    app.listen(9090, () => {
      console.log(`Server is running on port 9090`);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.error("Full Error:", error);
  }
};

start();
