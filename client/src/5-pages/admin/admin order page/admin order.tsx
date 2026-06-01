import { useEffect, useRef, useState } from "react";
import { api } from "../../../6-services/api";
import type { ApiResponse, ApiVoidResponse} from "../../../7-types/response/response api";
import type { orderDTO } from "../../../7-types/dto/orderDTO";
import styles from "./OrderPage.module.css";
import { toast, type Id } from "react-toastify";
import { getErrorMessage } from "../../../8-utils/error";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClientOrderPageSkeleton } from "../../client/client order page/client order skeleton";
import { ChevronRight } from "lucide-react";

export function OrderPage() {
  const [data, setData] = useState<orderDTO>();
  const [click, setClick] = useState(0);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toastId = useRef<Id | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findOrder() {
      try {
        const response = await api.get(`/admin/orders/${orderId}`);
        const result: ApiResponse<orderDTO> = response.data;
        const order = result.data;
        setData(order);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      } finally{
        setLoading(false);
      }
    }

    findOrder();
  }, [click]);

  const confirmDeletion = async () => {
    try {
      const response = await api.delete(`/admin/orders/${orderId}`);
      const result:ApiVoidResponse = response.data;
      if (!toast.isActive('success-toast')) {
        toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
      }
      navigate('/admin/orders');
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  };

  const handleDelete = () => {
    if (toast.isActive('delete-item')) return;

    toastId.current = toast(
      <div className={styles.toastBody}>
        <p className={styles.toastText}>Delete order?</p>
        <div className={styles.toastActions}>
          <button className={styles.toastConfirm} onClick={() => { confirmDeletion(); toast.dismiss('delete-item'); }}>
            Confirm
          </button>
          <button className={styles.toastCancel} onClick={() => toast.dismiss('delete-item')}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, toastId: 'delete-item', position:'top-center' }
    );
  };

  const handleStatus = async (status: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status/${status}`);
      setClick(prev => prev + 1);
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
      setClick(prev => prev + 1);
    }
  };

  const changeStatus = (status: string) => {
    switch (status) {
      case 'Pending': return 'Confirmed';
      case 'Confirmed': return 'Shipped';
      case 'Shipped': return 'Delivered';
      default: return null;
    }
  };

  if (loading) return <ClientOrderPageSkeleton/>;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <h1 className={styles.title}>
          <Link to={'/'} className={styles.link}>Home</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={'/admin/orders'}>Orders</Link>
          <ChevronRight style={{color:'#C9989B', verticalAlign: 'middle'}} strokeWidth={2} size={25}></ChevronRight>
          <Link className={styles.link} to={`/admin/orders/${data?._id}`}>Order</Link>
        </h1>

        {data&&
        <div className={styles.panels}>
          <div className={styles.cartColumn}>
            <div className={styles.cartPanel}>
              {data.content.map(item => (
                <div key={item.productName} className={styles.cartItem}>
                  <Link to={`/product/${item._id}`} className={styles.imageWrapper}>
                    <img
                      src={item.pictureName}
                      crossOrigin="use-credentials"
                      alt={item.productName}
                      className={styles.cartImage}
                    />
                  </Link>
                  <p><Link to={`/admin/product/${item._id}`} className={styles.nameLink}>{item.productName}</Link> × {item.quantity}</p>
                </div>
              ))}
              <p className={styles.total}>Total: {data.total.toFixed(2)} MAD</p>
            </div>
          </div>

          <div className={styles.summaryPanel}>
            <div className={styles.topRow}>
              <h2 className={styles.summaryTitle}>Order Status:</h2>
              <span className={`${styles.status} ${styles[`status${data.status}`]}`}>{data.status}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span style={{fontWeight: 'bold'}}>Name:</span>
                <span>{`${data.firstName} ${data.lastName}`}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.summaryRow}>
                <span style={{fontWeight: 'bold'}}>Email:</span>
                <span>{data.email}</span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow}`}>
                <span style={{fontWeight: 'bold'}}>Address:</span>
                <span>{data.address}</span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow}`}>
                <span style={{fontWeight: 'bold'}}>City:</span>
                <span>{data.city}</span>
              </div>

              <div className={styles.divider} />
              
              <div className={`${styles.summaryRow}`}>
                <span style={{fontWeight: 'bold'}}>Phone Number:</span>
                <span>{data.phoneNumber}</span>
              </div>
            </div>

            {(data.status !== 'Cancelled' && data.status !== 'Delivered') && (
              <button
                className={styles.btnStatus}
                onClick={() => {
                  const next = changeStatus(data.status);
                  if (next) handleStatus(next);
                }}
              >
                Move to: {changeStatus(data.status)}
              </button>
            )}
            {(data.status === 'Cancelled' || data.status === 'Delivered') && (
              <button
                className={styles.btnDelete}
                onClick={() => handleDelete()}
              >
                Delete order
              </button>
            )}
          </div>
        </div>
        }
      </div>
    </div>
  );
}