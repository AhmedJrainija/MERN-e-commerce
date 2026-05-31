import styles from "./HomePage.module.css";
import { Skeleton } from "../../4-components/9-skeleton/skeleton";

const HomeSkeletonCard = () => (
  <div className={styles.card}>
    <div className={styles.imageLink}>
      <Skeleton width="100%" height="100%" borderRadius={0} />
    </div>
    <div className={styles.cardBody}>
      <div className={styles.nameRow}>
        <Skeleton width="60%" height={14} />
        <Skeleton width={26} height={26} borderRadius={6} />
      </div>
      <Skeleton width="35%" height={13} />
    </div>
  </div>
);

export const HomeSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.inner}>
      <Skeleton width={60} height={20} />
      <Skeleton width={200} height={38} borderRadius={8} />
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <HomeSkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);