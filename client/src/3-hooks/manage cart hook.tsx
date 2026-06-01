import { useNavigate } from "react-router-dom";
import { useCart } from "../2-context/cartContext";
import { useAuth } from "../2-context/authContext";
import { api } from "../6-services/api";
import { getErrorMessage } from "../8-utils/error";
import { toast } from "react-toastify";


export function useManageCart (){
  const {getCart, cart} = useCart();
  const {role} = useAuth();
  const navigate = useNavigate();

  const handleClick = async (path: string, method: "post" | "patch" | "delete", quantity: number) => {
    try{

      if(role === 'Client') {
        await api[method](path);

        getCart((cart ?? 0) + quantity);

      } else {
        navigate('/login');
      }

    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  }

  return {handleClick}
}