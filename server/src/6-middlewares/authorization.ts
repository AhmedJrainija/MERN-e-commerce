import {Request, Response, NextFunction} from "express";
import { AppError } from "../8-utils/custom error class.js";


export const authorizedUsers = (...allowedRoles: string[]) => {
  return (req: Request, res:Response, next:NextFunction) => {

    try{
      const user = req.user;

      if(!user) {
        throw new AppError("Authentication required", 401);
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError("Forbidden: insufficient permissions", 403);
      }

      next();

    } catch (error){
      next(error);
    }
  };
};