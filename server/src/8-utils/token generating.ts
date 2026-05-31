import jwt from "jsonwebtoken";
import { JwtPayload } from "../7-types/common/jwt.interface.js";
import { env } from "../1-config/env.js";

export const generateAccessToken = (user: JwtPayload) => {
  return jwt.sign(
    {email: user.email, role: user.role, id: user?.id},
    env.ACCESS_TOKEN_SECRET,
    {expiresIn: "1h"}
  )
}

export const generateRefreshToken = (user: JwtPayload) => {
  return jwt.sign(
    {email: user.email, role: user.role, id: user?.id},
    env.REFRESH_TOKEN_SECRET,
    {expiresIn: "7d"}
  )
}