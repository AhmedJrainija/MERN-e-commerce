import type { ProductDTO } from "../7-types/dto/productDTO";

export const calculateTotal = (data: ProductDTO[]) => {
  let total = 0;
  data.map (item => (total = total + (item.price * item.quantity)));

  return total.toFixed(2);
}