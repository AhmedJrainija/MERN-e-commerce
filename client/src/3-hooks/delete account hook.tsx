import { api } from "../6-services/api";
import { useAuth } from "../2-context/authContext";
import { useCart } from "../2-context/cartContext";
import { getErrorMessage } from "../8-utils/error";
import { toast } from "react-toastify";
import type { ApiVoidResponse } from "../7-types/response/response api";

export function useDeleteAccount () {
  const{logout} = useAuth();
  const {removeCart} = useCart();

  const handleDeleteAccount = async () => {
    try{
      const response = await api.delete('/profile');

      const result:ApiVoidResponse = response.data;

      if (!toast.isActive('success-toast')) {
        toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
      }

      logout();

      removeCart();

    }catch(error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  }
  return {handleDeleteAccount}
}