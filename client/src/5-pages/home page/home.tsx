import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import styles from "./HomePage.module.css";
import { toast } from 'react-toastify';
import type {FindProductDTO, ProductDTO } from "../../7-types/dto/productDTO";
import { useManageCart } from "../../3-hooks/manage cart hook";
import { api } from "../../6-services/api";
import type { ApiResponse } from "../../7-types/response/response api";
import { getErrorMessage } from "../../8-utils/error";
import { Empty } from "../../4-components/6-empty component/empty";
import { allowedCategories } from "../../4-components/5-forms/product form/product form";
import { HomeSkeleton } from "./home skeleton";



export function Home() {
  const [data, setData] = useState<ProductDTO[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const { handleClick } = useManageCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/', { params: { category: query, page, limit } });
        const result: ApiResponse<FindProductDTO> = response.data;
        const { products, totalPages, hasNextPage, hasPrevPage } = result.data;
        setData(products);
        setTotalPages(totalPages);
        setHasNextPage(hasNextPage);
        setHasPrevPage(hasPrevPage);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [query, page]);

  if (loading) return <HomeSkeleton/>;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}><Link to={'/'} className={styles.link}>Home</Link></h1>

        <select
          className={styles.filterSelect}
          value={query}
          onChange={(e) => {setQuery(e.target.value); setPage(1);}}
        >
          <option value="" disabled hidden>Filter by category</option>
          <option value="">All</option>
          {allowedCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className={styles.grid}>
          {data.length > 0 && (
            data.map(product => (
              product.stock >0 &&
              <div key={product._id} className={styles.card}>

                <Link to={`/product/${product._id}`} className={styles.imageLink}>
                  <img
                    className={styles.image}
                    src={`${BASE_URL}/products/${product.pictureName}`}
                    crossOrigin="use-credentials"
                    alt={product.productName}
                  />
                </Link>
                <div className={styles.cardBody}>
                  <div className={styles.nameRow}>
                    <Link to={`/product/${product._id}`} className={styles.nameLink}>
                      {product.productName}
                    </Link>
                    <button
                      className={styles.addBtn}
                      onClick={() => handleClick(`/add/${product._id}`, 'post', 1)}
                    >
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>

                  <p className={styles.price}> {product.price.toFixed(2)} MAD</p>
                </div>

              </div>
            ))
          )}
        </div>

        {data.length > 0 && totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => setPage(p => p - 1)} disabled={!hasPrevPage}>
              <ChevronLeft size={16} />
            </button>

            <span className={styles.pageInfo}>{page} / {totalPages}</span>

            <button className={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={!hasNextPage}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {data.length === 0 &&<Empty name="Products" message="No Products"></Empty>}
      </div>
    </div>
  );
}