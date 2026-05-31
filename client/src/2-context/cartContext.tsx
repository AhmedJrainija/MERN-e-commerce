import { createContext, useState, useContext } from "react";

type CartContextType = {
  cart: number | null,
  getCart: ( cartLength: number) =>void,
  removeCart: ()=> void
};

const CartContext = createContext<CartContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: Props) => {

  const [cart, setCart] = useState<number | null>(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? Number(stored) : null;
  });

  const getCart = (cartLength: number) => {
    setCart(cartLength);
    sessionStorage.setItem("cart", `${cartLength}`);
  };

  const removeCart = () => {
    setCart(null);
    sessionStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, getCart, removeCart}}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
