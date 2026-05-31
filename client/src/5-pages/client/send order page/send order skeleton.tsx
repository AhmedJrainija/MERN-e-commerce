import styles from "./SendOrder.module.css";
import { Skeleton } from "../../../4-components/9-skeleton/skeleton";

const CartItemSkeleton = () => (
  <div className={styles.cartItem}>
    <Skeleton width={64} height={64} borderRadius={6} />
    <Skeleton width={160} height={14} />
  </div>
);

export const SendOrderSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>
      <Skeleton width={130} height={20} />
      <div className={styles.panels}>

        <div className={styles.cartColumn}>
          <div className={styles.cartPanel}>
            <CartItemSkeleton />
            <CartItemSkeleton />
            <CartItemSkeleton />
            <div className={styles.total}>
              <Skeleton width={120} height={15} />
            </div>
          </div>
        </div>

        <div className={styles.formColumn}>
          <div className={styles.formInner}>
            <Skeleton width="100%" height={500} borderRadius={8} />
          </div>
        </div>

      </div>
    </div>
  </div>
);