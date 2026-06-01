import { toast } from "react-toastify";
import { useOrderForm } from "../../../3-hooks/order form hook";
import { getErrorMessage } from "../../../8-utils/error";
import { OrderForm } from "../../../4-components/5-forms/order form/order form";
import styles from "./SendOrder.module.css"
import { useEffect, useState } from "react";
import { api } from "../../../6-services/api";
import type { ApiResponse } from "../../../7-types/response/response api";
import type { ProductDTO } from "../../../7-types/dto/productDTO";
import { useCart } from "../../../2-context/cartContext";
import { calculateTotal } from "../../../8-utils/total";
import { Link } from "react-router-dom";
import { SendOrderSkeleton } from "./send order skeleton";
import { ChevronRight } from "lucide-react";

export function SendOrder() {
  const { order, setOrder, handleSubmit } = useOrderForm();
  const [data, setData] = useState<ProductDTO[]>([]);
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCart() {
      try {
        const response = await api.get('/cart');
        const result: ApiResponse<ProductDTO[]> = response.data;
        const cart = result.data;
        setData(cart);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast' });
        }
      } finally {
        setLoading(false);
      }
    }

    findCart();
  }, [cart]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast' });
      }
    }
  };

  if (loading) return <SendOrderSkeleton />;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/cart'}>Cart</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/cart/order'}>Send Order</Link>
        </h1>
        <div className={styles.panels}>
          <div className={styles.cartColumn}>
            <div className={styles.cartPanel}>
              {data.map(item => (
                <div key={item.productName} className={styles.cartItem}>
                  <Link to={`/product/${item._id}`} className={styles.imageWrapper}>
                    <img
                      src={item.pictureName}
                      crossOrigin="use-credentials"
                      alt={item.productName}
                      className={styles.cartImage}
                    />
                  </Link>
                  <p><Link to={`/product/${item._id}`} className={styles.nameLink}>{item.productName}</Link> × {item.quantity}</p>
                </div>
              ))}
              <p className={styles.total}>Total: {calculateTotal(data)} MAD</p>
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formInner}>
              <OrderForm order={order} onChange={setOrder} onSubmit={onSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}