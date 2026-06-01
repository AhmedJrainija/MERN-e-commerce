import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./EditProduct.module.css"
import { toast, type Id } from "react-toastify";
import { useProductForm } from "../../../3-hooks/product form hook";
import type { ProductDTO } from "../../../7-types/dto/productDTO";
import { api } from "../../../6-services/api";
import type { ApiResponse, ApiVoidResponse } from "../../../7-types/response/response api";
import { getErrorMessage } from "../../../8-utils/error";
import { ProductForm } from "../../../4-components/5-forms/product form/product form";
import { ChevronRight } from "lucide-react";

export function EditProduct() {
  const { productId } = useParams();
  const { product, setProduct, handleSubmit, click } = useProductForm("patch", `/admin/product/${productId}`);
  const [data, setData] = useState<ProductDTO & {inOrders: boolean}>();
  const [previewURL, setPreview] = useState('');
  const navigate = useNavigate();
  const toastId = useRef<Id | undefined>(undefined);

  useEffect(() => {
    async function findProduct() {
      try {
        const response = await api.get(`/admin/product/${productId}`);
        const res: ApiResponse<ProductDTO & {inOrders: boolean}> = response.data;
        const p = res.data;
        setData(p);
        setPreview(`${p.pictureName}`);
        setProduct({ productName: p.productName, price: p.price, stock: p.stock, description: p.description, category: p.category, image: null });
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      }
    }
    findProduct();
  }, [click]);

  const confirmDeletion = async () => {
    try {
      const response = await api.delete(`/admin/product/${productId}`);
      const result: ApiVoidResponse = response.data;
      if (!toast.isActive('success-toast')) {
        toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
      }
      navigate('/admin/products');
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  };

  const deleteProduct = () => {
    if (toast.isActive('delete-item')) return;

    toastId.current = toast(
      <div className={styles.toastBody}>
        <p className={styles.toastText}>Delete this product?</p>
        <div className={styles.toastActions}>
          <button className={styles.toastConfirm} onClick={() => { confirmDeletion(); toast.dismiss('delete-item'); }}>
            Confirm
          </button>
          <button className={styles.toastCancel} onClick={() => toast.dismiss('delete-item')}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, toastId: 'delete-item', position:'top-center' }
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/admin/products'}>Manage Products</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={`/admin/product/${data?._id}`}>Edit {data?.productName}</Link>
        </h1>

        <div className={styles.layout}>

          <div className={styles.imageWrapper}>
            <img
              className={styles.image}
              src={previewURL}
              alt={data?.productName}
            />
          </div>

          <div className={styles.formColumn}>
            <ProductForm
              product={product}
              onChange={setProduct}
              onSubmit={handleSubmit}
              submitLabel="Save Edit"
              onDelete={deleteProduct}
              onOrders={() => navigate(`/admin/product/${productId}/orders`)}
              onPreview={setPreview}
            />
          </div>

        </div>

      </div>
    </div>
  );
}