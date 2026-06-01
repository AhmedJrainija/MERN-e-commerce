import { useNavigate } from "react-router-dom";
import { useCart } from "../2-context/cartContext";
import { useAuth } from "../2-context/authContext";
import { api } from "../6-services/api";
import { getErrorMessage } from "../8-utils/error";
import { toast } from "react-toastify";


export function useManageCart() {
  const { getCart, cart } = useCart();
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleClick = async (
    path: string,
    method: "post" | "patch" | "delete",
    quantity: number
  ) => {
    if (role !== "Client") {
      navigate("/login");
      return;
    }

    // ✅ Update UI immediately, don't wait for API
    const previousCart = cart ?? 0;
    getCart(previousCart + quantity);

    try {
      await api[method](path);
    } catch (error) {
      // ✅ Roll back on failure
      getCart(previousCart);

      if (!toast.isActive("error-toast")) {
        toast.error(getErrorMessage(error), { toastId: "error-toast" });
      }
    }
  };

  return { handleClick };
}