import { Types } from "mongoose";

export type cartDTO = Types.Map<number> ;

export interface ClientDTO {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  cart: cartDTO
}