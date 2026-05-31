import { useEffect, useState } from "react";
import { api } from "../../../6-services/api";
import type { ApiResponse } from "../../../7-types/response/response api";
import type { FindOrderDTO, orderDTO } from "../../../7-types/dto/orderDTO";
import styles from "./ClientOrders.module.css";
import { toast } from "react-toastify";
import { Empty } from "../../../4-components/6-empty component/empty";
import { OrderComponent } from "../../../4-components/4-order component/order component";
import { getErrorMessage } from "../../../8-utils/error";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrdersPageSkeleton } from "./orders skeleton";

export function OrdersPage() {
  const [data, setData] = useState<orderDTO[]>([]);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findOrders() {
      try {
        const response = await api.get('/orders', { params: { page, limit }});
        const result: ApiResponse<FindOrderDTO> = response.data;
        const { populatedOrders, totalPages, hasNextPage, hasPrevPage } = result.data;
        setData(populatedOrders);
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

    findOrders();
  }, [page]);

  if (loading) return <OrdersPageSkeleton />;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/orders'}>Orders</Link>
        </h1>

        {data.length > 0 && (
          <div className={styles.orderList}>
            {data.map(order => (
              <div key={order._id} className={styles.orderWrapper}>
                <Link to={`/orders/${order._id}`} style={{textDecorationLine: 'none'}}>
                  <OrderComponent {...order} />
                </Link>
              </div>
            ))}
          </div>
        )}

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

        {data.length === 0 &&<Empty name="Orders" message="No Order was made yet"></Empty>}
      </div>
    </div>
  );
}