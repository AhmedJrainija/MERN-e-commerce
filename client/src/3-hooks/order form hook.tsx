import { useState } from "react";
import type { orderDTO, orderUpload } from "../7-types/dto/orderDTO";
import { useNavigate } from "react-router-dom";
import { api } from "../6-services/api";
import { useCart } from "../2-context/cartContext";
import type { ApiResponse } from "../7-types/response/response api";
import { toast } from "react-toastify";

export const initialOrder = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  city: '',
  address: '',
}

export function useOrderForm() {
  const [order, setOrder] = useState<orderUpload>(initialOrder);
  const navigate = useNavigate();
  const {getCart} = useCart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {firstName, lastName, email, phoneNumber, city, address} = order;

    const response =await api.post('/cart/order', {firstName, lastName, email, phoneNumber, city, address});
    const result:ApiResponse<orderDTO[]> = response.data;
    if (!toast.isActive('success-toast')) {
      toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
    }
    getCart(0);
    navigate('/orders');
  };

  return { order, setOrder, handleSubmit };
}