import { useAuth } from "../2-context/authContext";
import { useCart } from "../2-context/cartContext";
import { api } from "../6-services/api";
import { getErrorMessage } from "../8-utils/error";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function useLogout () {

  const {logout, role} = useAuth();
  const {removeCart} = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{

      if(role === 'Client'){ 
        await api.get('/logout');
      }

      if(role === 'Admin') {
        await api.get('/admin/logout');
      }

      logout();

      removeCart();

      navigate('/');

    } catch(error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  }
  return {handleLogout}
}