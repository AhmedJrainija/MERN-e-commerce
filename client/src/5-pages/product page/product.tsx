import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import styles from "./ProductPage.module.css";
import { toast } from 'react-toastify';
import type { ProductDTO } from "../../7-types/dto/productDTO";
import { useCart } from "../../2-context/cartContext";
import { useManageCart } from "../../3-hooks/manage cart hook";
import { api } from "../../6-services/api";
import type { ApiResponse } from "../../7-types/response/response api";
import { getErrorMessage } from "../../8-utils/error";
import { ProductPageSkeleton } from "./product skeleton";


export function ProductPage() {
  const { productId } = useParams();
  const [data, setData] = useState<ProductDTO>();
  const { cart } = useCart();
  const { handleClick } = useManageCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findProduct() {
      try {
        const response = await api.get(`/product/${productId}`);
        const result: ApiResponse<ProductDTO> = response.data;
        const product = result.data;
        setData(product);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      } finally {
        setLoading(false);
      }
    }

    findProduct();
  }, [cart]);

  if (loading) return <ProductPageSkeleton />;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>&nbsp;/&nbsp;
          <Link className={styles.link} to={`/product/${data?._id}`}>{data?.productName}</Link>
        </h1>

        {data && (
          <div className={styles.layout}>

            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src={data.pictureName}
                alt={data.productName}
              />
            </div>

            <div className={styles.card}>
              <div className={styles.info}>
                <p className={styles.category}>{data.category}</p>
                <h1 className={styles.name}>{data.productName}</h1>

                <div className={styles.divider} />

                <p className={styles.description}>{data.description}</p>

                <div className={styles.divider} />

                <p className={styles.price}>
                  {data.price.toFixed(2)}
                  <span className={styles.priceCurrency}>MAD</span>
                </p>

                {data.stock > 0 ? (
                  <button
                    className={styles.btnAdd}
                    onClick={() => handleClick(`/product/${data._id}`, 'post', 1)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <p style={{color:'red', margin:'0'}}>{'Product is out of stock'}</p>
                )}

                <Link to="/cart" className={styles.cartLink}>
                  <ShoppingCart size={14} strokeWidth={1.5} />
                  View cart ({cart})
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}