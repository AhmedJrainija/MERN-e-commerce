import styles from "./ProductPage.module.css";
import { Skeleton } from "../../4-components/9-skeleton/skeleton";

export const ProductPageSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>

      <Skeleton width={70} height={20} />

      <div className={styles.layout}>

        <div className={styles.imageWrapper}>
          <Skeleton width="100%" height="100%" borderRadius={0} />
        </div>

        <div className={styles.card}>
          <div className={styles.info}>
            <Skeleton width="30%" height={11} />
            <Skeleton width="60%" height={22} />
            <div className={styles.divider} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton width="100%" height={14} />
              <Skeleton width="90%" height={14} />
              <Skeleton width="75%" height={14} />
            </div>
            <div className={styles.divider} />
            <Skeleton width="25%" height={22} />
            <Skeleton width="100%" height={40} borderRadius={8} />
            <Skeleton width={100} height={13} />
          </div>
        </div>

      </div>
    </div>
  </div>
);