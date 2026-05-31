import styles from "./ClientOrders.module.css";
import orderStyles from "../../../4-components/4-order component/OrderComponent.module.css";
import { Skeleton } from "../../../4-components/9-skeleton/skeleton";

const OrderComponentSkeleton = () => (
  <div className={orderStyles.card}>
    <div className={orderStyles.topRow}>
      <Skeleton width={180} height={13} />
      <Skeleton width={70} height={22} borderRadius={20} />
    </div>
    <div className={orderStyles.divider} />
    <Skeleton width={220} height={12} />
    <div className={orderStyles.divider} />
    <div className={orderStyles.footer}>
      <Skeleton width="50%" height={13} />
      <Skeleton width={90} height={15} />
    </div>
  </div>
);

export const OrdersPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>
      <Skeleton width={110} height={20} />
      <div className={styles.orderList}>
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
        <OrderComponentSkeleton />
      </div>
    </div>
  </div>
);