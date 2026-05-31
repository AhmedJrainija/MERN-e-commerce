import styles from "./ClientOrderPage.module.css";
import { Skeleton } from "../../../4-components/9-skeleton/skeleton";

const CartItemSkeleton = () => (
  <div className={styles.cartItem}>
    <Skeleton width={64} height={64} borderRadius={6} />
    <Skeleton width={160} height={14} />
  </div>
);

export const ClientOrderPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>

      <Skeleton width={100} height={20} />

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

        <div className={styles.summaryPanel}>
          <div className={styles.topRow}>
            <Skeleton width={110} height={16} />
            <Skeleton width={70} height={22} borderRadius={20} />
          </div>

          <div className={styles.divider} />

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <Skeleton width={50} height={14} />
              <Skeleton width={120} height={14} />
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <Skeleton width={45} height={14} />
              <Skeleton width={150} height={14} />
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <Skeleton width={60} height={14} />
              <Skeleton width={130} height={14} />
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <Skeleton width={35} height={14} />
              <Skeleton width={80} height={14} />
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <Skeleton width={100} height={14} />
              <Skeleton width={90} height={14} />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);