export interface ProductDTO {
  productName: string,
  price: number,
  category: string,
  stock: number,
  description: string,
  pictureName: string,
  quantity?: number
}

export interface FindProductDTO {
  products: ProductDTO[],
  page: number,
  limit: number,
  totalProducts: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean
}