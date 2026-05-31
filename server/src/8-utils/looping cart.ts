import { cartDTO } from "../7-types/dto/clientDTO.js";
import { ProductDTO } from "../7-types/dto/productDTO.js";
import { ProductModel } from "../2-models/product.model.js";

export const loopCart = async (data: cartDTO) => {

  const cartItems: ProductDTO[] = [];

  try{
    for (let [key, value] of data.entries()) {

      const item = await ProductModel.findById(key).lean();

      if(item) {
        item.quantity = value;
        
        cartItems.push(item);
      }
    }

    return cartItems;
    
  } catch (error) {
    throw error;
  }
}


export const cartSize = (data: cartDTO) => {
  let size = 0;
  for (let [key, value] of data.entries()) {
    size = size + value;
  }

  return size;
}