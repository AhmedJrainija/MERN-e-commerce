import { useEffect, useState } from "react";
import type { FindOrderDTO, orderDTO } from "../../../7-types/dto/orderDTO";
import type { ApiResponse } from "../../../7-types/response/response api";
import { api } from "../../../6-services/api";
import { getErrorMessage } from "../../../8-utils/error";
import styles from "./AllOrdersPage.module.css";
import { toast } from "react-toastify";
import { Empty } from "../../../4-components/6-empty component/empty";
import { OrderComponent } from "../../../4-components/4-order component/order component";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrdersPageSkeleton } from "../../client/client orders page/orders skeleton";

const statusAllowed = ["Pending" , "Confirmed" , "Shipped" , "Delivered" , "Cancelled"];

export function AllOrdersPage() {
  const [data, setData] = useState<orderDTO[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findOrders() {
      try {
        const response = await api.get('/admin/orders', { params: { status: query, page, limit } });
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
      } finally{
        setLoading(false);
      }
    }

    findOrders();
  }, [query, page]);

  if (loading) return <OrdersPageSkeleton />;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        
        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/admin/orders'}>Orders</Link>
        </h1>

        <select
          className={styles.filterSelect}
          value={query}
          onChange={(e) => {setQuery(e.target.value); setPage(1);}}
        >
          <option value="" disabled hidden>Filter by status</option>
          <option value="">All</option>
          {statusAllowed.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {data.length > 0 && (
          <div className={styles.orderList}>
            {data.map(order => (
              <div key={order._id} className={styles.orderWrapper}>

                <p className={styles.customerName}>{order.firstName} {order.lastName}</p>

                <Link to={`/admin/orders/${order._id}`} style={{textDecorationLine: 'none'}}>
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
        
        {data.length === 0 &&<Empty name="Orders" message="No Orders yet"></Empty>}
      </div>
    </div>
  );
}