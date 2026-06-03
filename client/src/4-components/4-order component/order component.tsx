import type { orderDTO } from "../../7-types/dto/orderDTO";
import styles from "./OrderComponent.module.css";

export function OrderComponent(data: orderDTO) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        {data.date && (
          <p className={styles.date}><b>Order placed on:</b>&nbsp;&nbsp;{new Date(data.date).toLocaleDateString()}</p>
        )}
        <span className={`${styles.status} ${styles[`status${data.status}`]}`}>{data.status}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.itemList}>
        <p className={styles.address}><b>Address:</b> &nbsp;&nbsp;{data.address}, {data.city}</p>
      </div>

      <div className={styles.divider} />
      <div className={styles.footer}>
        <p className={styles.items}>
          {data.content?.map(item => (
            <span key={item.productName} className={styles.item}>
              <b>Content:</b> &nbsp;&nbsp;{item.productName} × {item.quantity} &nbsp;
            </span>
          ))}
        </p>
        <div className={styles.dividerFooter} />
        <p className={styles.total}>Total: {data.total.toFixed(2)} MAD</p>
      </div>
    </div>
  );
}