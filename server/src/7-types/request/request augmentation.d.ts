// src/types/express/index.d.ts

import { MyJwtPayload } from "../common/jwt.interface.ts";

//import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}

// VERY IMPORTANT (NodeNext requirement)
export {};