import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;
import { Link } from "react-router-dom";
import styles from "./ProductsAdmin.module.css";
import { toast } from "react-toastify";
import type { FindProductDTO, ProductDTO } from "../../../7-types/dto/productDTO";
import type { ApiResponse } from "../../../7-types/response/response api";
import { getErrorMessage } from "react-error-boundary";
import { api } from "../../../6-services/api";
import { Empty } from "../../../4-components/6-empty component/empty";
import { allowedCategories } from "../../../4-components/5-forms/product form/product form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HomeSkeleton } from "../../home page/home skeleton";


export function ProductsAdmin() {
  const [data, setData] = useState<ProductDTO[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/admin/products', { params: { category: query, page, limit } });
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

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/admin/products'}>Manage Products</Link>
        </h1>

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
              <div key={product._id} className={styles.card}>

                <Link to={`/admin/product/${product._id}`} className={styles.imageLink}>
                  <img
                    className={styles.image}
                    src={`${BASE_URL}/products/${product.pictureName}`}
                    crossOrigin="use-credentials"
                    alt={product.productName}
                  />
                </Link>

                <div className={styles.cardBody}>
                  <Link to={`/admin/product/${product._id}`} className={styles.nameLink}>
                    {product.productName}
                  </Link>
                  {!product.stock && <p className={styles.error}>Out of stock</p>}
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

        {data.length === 0 && <Empty name="Products" message="No Products"></Empty>}
      </div>
    </div>
  );
}