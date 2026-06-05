import { toast } from "react-toastify";
import { useProductForm } from "../../../3-hooks/product form hook";
import { getErrorMessage } from "../../../8-utils/error";
import { ProductForm } from "../../../4-components/5-forms/product form/product form";
import styles from "./AddProduct.module.css"
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function AddProduct() {
  const { product, setProduct, handleSubmit } = useProductForm("post", "/admin/add");
  const [previewURL, setPreview] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>&nbsp;/&nbsp;
          <Link className={styles.link} to={'/admin/add'}>Add Product</Link>
        </h1>

          <div className={styles.layout}>
            <div className={styles.imageWrapper}>
              {previewURL ? 
                <img
                  className={styles.image}
                  src={previewURL}
                  alt={product.productName}
                /> 
              :
                <div className={styles.uploadPlaceholder}>
                  <ImageIcon />
                  <span>No image selected</span>
                </div>
              }
            </div>

            <div className={styles.formColumn}>
              <ProductForm product={product} onChange={setProduct} onSubmit={onSubmit} submitLabel="Add Product" onPreview={setPreview}/>
            </div>
          </div>
      </div>
    </div>
  );
}