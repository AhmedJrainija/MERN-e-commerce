import { useState } from "react";
import type { ProductDTO, ProductUpload } from "../7-types/dto/productDTO";
import { api } from "../6-services/api";
import { useNavigate } from "react-router-dom";
import type { ApiResponse, ApiVoidResponse } from "../7-types/response/response api";
import { toast } from "react-toastify";
import { initialProduct } from "../4-components/5-forms/product form/product form";
import { getErrorMessage } from "../8-utils/error";


export function useProductForm(method: "post" | "patch", path: string) {
  const [product, setProduct] = useState<ProductUpload>(initialProduct);
  const [click, setClick] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { productName, price, stock, description, category, image } = product;
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("description", description);
      formData.append("category", category);
      if (image) formData.append("file", image);

      const response = await api[method](path, formData);

      if (method === "post") {
        const result: ApiVoidResponse = response.data;
        if (!toast.isActive("success-toast")) {
          toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
        }
        navigate("/admin/products");
      }

      if (method === "patch") {
        const result: ApiResponse<ProductDTO> = response.data;
        if (!toast.isActive("success-toast")) {
          toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
        }
      }

      setClick((prev) => prev + 1);
    } catch (error) {
      if (!toast.isActive("error-toast")) {
        toast.error(getErrorMessage(error), { toastId: "error-toast" });
      }
    }
  };

  return { product, setProduct, handleSubmit, click };
}