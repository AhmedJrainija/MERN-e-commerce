import { Request, Response, NextFunction } from "express";
import { ApiVoidResponse } from "../7-types/response/response.api.js";
import mongoose from "mongoose";

const { ValidationError, CastError } = mongoose.Error;

interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response<ApiVoidResponse>,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;

  if (err instanceof ValidationError) {
    statusCode = 400;
    err.message = Object.values(err.errors)[0].message;
  }

  else if (err instanceof CastError) {
    statusCode = 400;
    err.message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  console.error("ERROR :", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message
  });

  return;
};