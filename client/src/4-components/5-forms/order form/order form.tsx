import type { orderUpload } from "../../../7-types/dto/orderDTO";
import styles from "./OrderForm.module.css";

interface OrderFormProps {
  order: orderUpload;
  onChange: (order: orderUpload) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function OrderForm({ order, onChange, onSubmit }: OrderFormProps) {
  const set = <K extends keyof orderUpload>(field: K, value: orderUpload[K]) =>
    onChange({ ...order, [field]: value });

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>First name</label>
          <input
            className={styles.input}
            type="text"
            minLength={3}
            maxLength={50}
            placeholder="First name"
            value={order.firstName}
            pattern="[a-zA-Z\s]+"
            onChange={(e) => set("firstName", e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Last name</label>
          <input
            className={styles.input}
            type="text"
            minLength={3}
            maxLength={50}
            placeholder="Last name"
            value={order.lastName}
            pattern="[a-zA-Z\s]+"
            onChange={(e) => set("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={order.email}
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone number</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="+212 (000) 000-0000"
            value={order.phoneNumber}
            pattern="^[0-9]{10}$"
            onChange={(e) => set("phoneNumber", e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>City</label>
          <input
            className={styles.input}
            placeholder="City"
            value={order.city}
            minLength={3}
            maxLength={50}
            pattern="[a-zA-Z\s]+"
            onChange={(e) => set("city", e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Address</label>
          <input
            className={styles.input}
            placeholder="Address"
            value={order.address}
            minLength={10}
            onChange={(e) => set("address", e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" className={styles.btn}>Confirm order</button>

    </form>
  );
}