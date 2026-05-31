export interface ProductDTO {
  _id: string
  productName: string,
  price: number,
  category: string,
  stock: number,
  description: string,
  pictureName: string,
  quantity: number
}


export interface ProductUpload {
  productName: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  image: File | null;
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