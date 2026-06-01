import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Minus, Plus, X } from "lucide-react";
import styles from "./CartPage.module.css";
import { toast } from "react-toastify";
import type { ProductDTO } from "../../../7-types/dto/productDTO";
import { useCart } from "../../../2-context/cartContext";
import { useManageCart } from "../../../3-hooks/manage cart hook";
import { api } from "../../../6-services/api";
import type { ApiResponse } from "../../../7-types/response/response api";
import { getErrorMessage } from "../../../8-utils/error";
import { calculateTotal } from "../../../8-utils/total";
import { Empty } from "../../../4-components/6-empty component/empty";
import { CartSkeleton } from "./cart skeleton";

export function Cart() {
  const [data, setData] = useState<ProductDTO[]>([]);
  const { cart } = useCart();
  const navigate = useNavigate();
  const { handleClick } = useManageCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCart() {
      try {
        const response = await api.get('/cart');
        const result: ApiResponse<ProductDTO[]> = response.data;
        setData(result.data);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      }finally {
        setLoading(false);
      }
    }
    findCart();
  }, [cart]);

  if (loading) return <CartSkeleton/>;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/cart'}>Cart</Link>
        </h1>

        {data.length > 0 ? (
          <div className={styles.layout}>

            {/* ── Left: items ── */}
            <div className={styles.itemsPanel}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Quantity</span>
                <span>Price</span>
                <span></span>
              </div>

              {data.map(item => (
                <div key={item._id} className={styles.itemRow}>

                  <div className={styles.productCell}>
                    <Link to={`/product/${item._id}`} className={styles.imageWrapper}>
                      <img
                        className={styles.image}
                        src={item.pictureName}
                        crossOrigin="use-credentials"
                        alt={item.productName}
                      />
                    </Link>
                    <div className={styles.productInfo}>
                      <Link to={`/product/${item._id}`} className={styles.nameLink}>{item.productName}</Link>
                    </div>
                  </div>

                  <div className={styles.qtyCell}>
                    <button
                      className={item.quantity > 1 ? styles.qtyBtn : styles.qtyBtnHidden}
                      onClick={() => item.quantity > 1 && handleClick(`/cart/${item._id}/substract`, "patch", -1)}
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    {item.stock
                      ? <button className={styles.qtyBtn} onClick={() => handleClick(`/cart/${item._id}/add`, "patch", 1)}><Plus size={13} strokeWidth={2} /></button>
                      : <button className={styles.outStock} onClick={() => toast.error('Product is out of stock')}><Plus size={13} strokeWidth={2} /></button>
                    }
                  </div>

                  <div className={styles.priceCell}>
                    {item.price.toFixed(2)} MAD
                  </div>

                  <button
                    className={styles.btnDelete}
                    onClick={() => handleClick(`/cart/${item._id}`, "delete", -item.quantity)}
                  >
                    <X size={15} strokeWidth={2} />
                  </button>

                </div>
              ))}
            </div>

            {/* ── Right: summary ── */}
            <div className={styles.summaryPanel}>
              <h2 className={styles.summaryTitle}>Order summary</h2>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{calculateTotal(data)} MAD</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.free}>Free</span>
                </div>
                <div className={styles.divider} />
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{calculateTotal(data)} MAD</span>
                </div>
              </div>

              <button className={styles.btnOrder} onClick={() => navigate('/cart/order')}>
                Confirm order
              </button>
            </div>

          </div>
        ) : (
          <Empty name="Cart" message="Your Cart is empty" />
        )}

      </div>
    </div>
  );
}