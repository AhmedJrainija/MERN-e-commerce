import { useNavigate } from "react-router-dom";
import { useCart } from "../2-context/cartContext";
import { useAuth } from "../2-context/authContext";
import { api } from "../6-services/api";
import { getErrorMessage } from "../8-utils/error";
import { toast } from "react-toastify";
import { useState } from "react";


export function useManageCart() {
  const { getCart, cart } = useCart();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [click, setClick] = useState(0);

  const handleClick = async (
    path: string,
    method: "post" | "patch" | "delete",
    quantity: number
  ) => {
    if (role !== "Client") {
      navigate("/login");
      return;
    }

    const previousCart = cart ?? 0;

    // Optimistic update — runs immediately, no waiting
    getCart(previousCart + quantity);

    setClick(prev => prev + 1);

    try {
      await api[method](path);
    } catch (error) {
      // Revert on failure
      getCart(previousCart);

      if (!toast.isActive("error-toast")) {
        toast.error(getErrorMessage(error), { toastId: "error-toast" });
      }
    }
  };

  return { handleClick, click };
}