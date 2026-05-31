import mongoose from "mongoose";
import { env } from "./env.js";
import { AppError } from "../8-utils/custom error class.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
   throw new AppError("Unable to connect to the database. Please try again later.", 500);
  }
};