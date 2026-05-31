import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { env } from "../1-config/env.js";
import { AppError } from "../8-utils/custom error class.js";
import { MyJwtPayload } from "../7-types/common/jwt.interface.js";


export const isUserLoggedIn = async (
req: Request,
res: Response,
next: NextFunction
): Promise<void> => {
  try {
    //const authHeader = req.headers.authorization;

    //const token = authHeader.split(" ")[1];

    const token = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!token) {
      if(refreshToken) {
        throw new AppError("Access token is expired", 401) ;
      }

      throw new AppError("User not logged in", 401);
    }

    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as MyJwtPayload; 

    if (typeof decoded === "string") {
      throw new AppError("Invalid or malformed access token", 401);
    }

    req.user = decoded;

    next();

  } catch (error) {
    next(error);
  }
};