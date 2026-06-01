import { useNavigate } from "react-router-dom";
import { useCart } from "../2-context/cartContext";
import { useAuth } from "../2-context/authContext";
import { api } from "../6-services/api";
import { getErrorMessage } from "../8-utils/error";
import { toast } from "react-toastify";

export function useManageCart(onOptimisticUpdate?: (id: string, delta: number) => void) {
  const { getCart, cart } = useCart();
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleClick = async (
    path: string,
    method: "post" | "patch" | "delete",
    quantity: number,
    itemId?: string,
  ) => {
    if (role !== "Client") {
      navigate("/login");
      return;
    }

    const previousCart = cart ?? 0;
    const delta = method === "delete" ? 0 : quantity;

    // Update UI instantly
    if (itemId && onOptimisticUpdate) onOptimisticUpdate(itemId, delta);
    getCart(previousCart + quantity);

    try {
      await api[method](path);
    } catch (error) {
      // Revert both on failure
      if (itemId && onOptimisticUpdate) onOptimisticUpdate(itemId, -delta);
      getCart(previousCart);

      if (!toast.isActive("error-toast")) {
        toast.error(getErrorMessage(error), { toastId: "error-toast" });
      }
    }
  };

  return { handleClick };
}