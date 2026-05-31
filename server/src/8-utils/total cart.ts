import { ProductDTO } from "../7-types/dto/productDTO.js";

export const calculateTotal = (data: ProductDTO[]) => {
  let total = 0;
  data.map (item => (total =  item.quantity? total + (item.price * item.quantity) : total));
  
  return total;
}