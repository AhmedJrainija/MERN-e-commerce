import { Date, Types } from "mongoose";
import { cartDTO } from "./clientDTO.js";
import { ProductDTO } from "./productDTO.js";


export interface orderDTO {
  customerId?: Types.ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string
  city: string,
  address: string,
  date?: Date,
  status?: string,
  content: cartDTO,
  total: number
}

export interface populatedOrderDTO extends Omit<orderDTO, 'content'> {
  content: ProductDTO[]
}

export interface FindOrderDTO {
  populatedOrders: populatedOrderDTO[],
  page: number,
  limit: number,
  totalOrders: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}