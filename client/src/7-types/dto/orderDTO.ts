import type { ProductDTO } from "./productDTO"

export interface orderDTO {
  _id: string
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string
  city: string,
  address: string,
  date: Date,
  status: string
  content: ProductDTO[],
  total: number
}

export interface orderUpload {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string
  city: string,
  address: string,
}

export interface FindOrderDTO {
  populatedOrders: orderDTO[],
  page: number,
  limit: number,
  totalOrders: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}