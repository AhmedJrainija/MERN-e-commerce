import type { ProductUpload } from "../../../7-types/dto/productDTO";
import styles from "./ProductForm.module.css";

export const allowedCategories = ["Electronics", "Accessories", "Beauty", "Garden", "Sports", "Toys", "Books", "Gaming", "Health", "Pet Supplies", "Automotive", "Office Supplies"];

export const initialProduct: ProductUpload = {
  productName: '',
  price: 0,
  stock: 0,
  description: '',
  category: 'Electronics',
  image: null
};

interface ProductFormProps {
  product: ProductUpload;
  onChange: (product: ProductUpload) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  onDelete?: () => void;
  onOrders?: () => void;
  onPreview: (url: string) => void
}

export function ProductForm({ product, onChange, onSubmit, submitLabel, onDelete, onOrders, onPreview }: ProductFormProps) {
  const set = <K extends keyof ProductUpload>(field: K, value: ProductUpload[K]) =>
    onChange({ ...product, [field]: value });

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("image", file);
    onPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>

      <div className={styles.field}>
        <label className={styles.label}>Product name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Name of the product"
          pattern="[a-zA-Z\s]+"
          minLength={3}
          maxLength={50}
          value={product.productName}
          onChange={(e) => set("productName", e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Price (DH)</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Price in DH"
            value={product.price}
            min={1}
            step={0.01}
            onChange={(e) => set("price", e.target.valueAsNumber)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Stock</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Stock available"
            value={product.stock}
            min={1}
            step={1}
            onChange={(e) => set("stock", e.target.valueAsNumber)}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Description of the product"
          value={product.description}
          minLength={30}
          maxLength={300}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <select
          className={styles.select}
          name="category"
          value={product.category}
          onChange={(e) => set("category", e.target.value)}
          required
        >
          {allowedCategories.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Image</label>
        <label className={styles.fileLabel}>
          <span>↑</span>
          <span>
            {product.image
              ? (product.image as File).name
              : 'Click to upload an image (JPEG or PNG)'}
          </span>
          <input
            className={styles.fileInput}
            type="file"
            accept="image/jpeg, image/png"
            onChange={uploadImage}
          />
        </label>
      </div>

      <button type="submit" className={styles.btn}>{submitLabel}</button>

      {onDelete && (
        <button type="button" className={styles.btn} onClick={onOrders}>
          Show Orders
        </button>
      )}

      {onDelete && (
        <button type="button" className={styles.btnDelete} onClick={onDelete}>
          Delete product
        </button>
      )}

    </form>
  );
}