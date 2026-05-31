import dotenv from "dotenv";
import {EnvConfig} from "../7-types/common/env.interface.js";
import { AppError } from "../8-utils/custom error class.js";

dotenv.config();


const getEnv = (): EnvConfig => {
  const {
    PORT,
    DB_URL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
  } = process.env

  if (!PORT) throw new AppError("Server configuration error: PORT is not defined", 500);

  if (!DB_URL) throw new AppError("Server configuration error: Database URL is not defined", 500);

  if (!ADMIN_EMAIL) throw new AppError("Server configuration error: Admin email is not defined", 500);

  if (!ADMIN_PASSWORD) throw new AppError("Server configuration error: Admin password is not defined", 500);

  if (!ACCESS_TOKEN_SECRET) throw new AppError("Server configuration error: Access token secret is not defined", 500);

  if (!REFRESH_TOKEN_SECRET) throw new AppError("Server configuration error: Refresh token secret is not defined", 500);


  return {
    PORT: Number(PORT),
    DB_URL,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
  }
}

export const env = getEnv();