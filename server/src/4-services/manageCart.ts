import { AppError} from "../8-utils/custom error class.js";
import { ProductModel} from "../2-models/product.model.js";
import { clientModel } from "../2-models/client.model.js";
import { ProductDTO } from "../7-types/dto/productDTO.js";
import { cartSize, loopCart } from "../8-utils/looping cart.js";


export const addingToCart = async (clientId: string, itemId: string, quantity: number): Promise<ProductDTO[]> => {

  try {
    const client = await clientModel.findById(clientId)

    if (!client) {
      throw new AppError("Client does not exist", 404);
    }

    const product = await ProductModel.findById(itemId)

    if (!product) {
      throw new AppError("Product does not exist", 404);
    }

    if (product.stock <= 0) {
      throw new AppError("Product is out of stock", 400);
    }

    const cart = client.cart;

    const size = cartSize(cart);

    if(size >= 20) {
      throw new AppError("Cart is full", 400);
    }

    const currentQuantity = cart.has(itemId) ? cart.get(itemId) as number : 0;

    if (currentQuantity >= product.stock) {
      throw new AppError(
        `Not enough stock.`,
        400
      );
    }

    if (currentQuantity >= 10) {
      throw new AppError(
        'Cart limit reached for this product',
        400
      );
    }

    cart.set(itemId, currentQuantity + quantity);

    await clientModel.findByIdAndUpdate(clientId, { $set: { cart } });

    const cartItems = await loopCart(cart);

    return cartItems;

  } catch (error) {
    throw error;
  }
};


export const updateItem = async (clientId: string, itemId: string, quantity: number): Promise<ProductDTO[]> => {

  try {
    const client = await clientModel.findById(clientId);

    if (!client) {
      throw new AppError("Client does not exist", 404);
    }

    const product = await ProductModel.findById(itemId);

    if (!product) {
      throw new AppError("Product does not exist", 404);
    }

    if (quantity > 0 && product.stock <= 0) {
      throw new AppError("Product is out of stock", 400);
    }

    const cart = client.cart;

    const size = cartSize(cart);

    if(quantity > 0 && size >= 20) {
      throw new AppError("Cart is full", 400);
    }

    const currentQuantity = cart.get(itemId);

    if (!currentQuantity) {
      throw new AppError("Item is not in cart", 404);
    }

    if (quantity > 0 && currentQuantity >= product.stock) {
      throw new AppError(
        `Not enough stock`,
        400
      );
    }

    if (quantity > 0 && currentQuantity >= 10) {
      throw new AppError(
        'Cart limit reached for this product',
        400
      );
    }
    
    if (quantity < 0 && (currentQuantity + quantity) <= 0) {
      cart.delete(itemId);
    } else {
      cart.set(itemId, currentQuantity + quantity);
    }

    await clientModel.findByIdAndUpdate(clientId, { $set: { cart } });
    const cartItems = await loopCart(cart);
    return cartItems;

      } catch (error) {
        throw error;
      }
    };


export const removeItem = async (clientId: string, itemId: string): Promise<ProductDTO[]> => {

  try {
    const client = await clientModel.findById(clientId)

    if (!client) {
      throw new AppError("Client does not exist", 404);
    }

    const product = await ProductModel.findById(itemId)

    if (!product) {
      throw new AppError("Product does not exist", 404);
    }

    const cart = client.cart;
    const quantity = cart.get(itemId);

    if (!quantity) {
      throw new AppError("Item is not in cart", 404);
    }

    cart.delete(itemId);

    await clientModel.findByIdAndUpdate(clientId, { $set: { cart } });

    const cartItems = await loopCart(cart);

    return cartItems;

  } catch (error) {
    throw error;
  }
};