import styles from "./CartPage.module.css";
import { Skeleton } from "../../../4-components/9-skeleton/skeleton";

const CartItemSkeleton = () => (
  <div className={styles.itemRow}>
    <div className={styles.productCell}>
      <Skeleton width={64} height={64} borderRadius={10} />
      <Skeleton width={120} height={14} />
    </div>
    <div className={styles.qtyCell}>
      <Skeleton width={28} height={28} borderRadius={7} />
      <Skeleton width={20} height={14} />
      <Skeleton width={28} height={28} borderRadius={7} />
    </div>
    <Skeleton width={80} height={14} />
    <Skeleton width={28} height={28} borderRadius={7} />
  </div>
);

export const CartSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>

      <Skeleton width={90} height={20} />

      <div className={styles.layout}>

        <div className={styles.itemsPanel}>
          <div className={styles.tableHeader}>
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
            <span></span>
          </div>
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>

        <div className={styles.summaryPanel}>
          <Skeleton width="50%" height={16} />
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <Skeleton width="30%" height={14} />
              <Skeleton width="25%" height={14} />
            </div>
            <div className={styles.summaryRow}>
              <Skeleton width="30%" height={14} />
              <Skeleton width="20%" height={14} />
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <Skeleton width="20%" height={16} />
              <Skeleton width="30%" height={16} />
            </div>
          </div>
          <Skeleton width="100%" height={42} borderRadius={10} />
        </div>

      </div>
    </div>
  </div>
);