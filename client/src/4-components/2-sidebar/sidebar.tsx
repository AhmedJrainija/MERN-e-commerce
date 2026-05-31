import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ClipboardList, Plus, ShoppingCart, Menu, X, LogIn, House, UserPlus } from "lucide-react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../2-context/authContext";
import { useCart } from "../../2-context/cartContext";
import { useLogout } from "../../3-hooks/logout hook";
import { UserPen } from 'lucide-react';


export function SideBar() {
  const navigate = useNavigate();
  const { isAuth, role } = useAuth();
  const [open, setOpen] = useState(false);
  const {cart} = useCart();
  const {handleLogout} = useLogout();

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button className={styles.toggleBtn} onClick={() => setOpen(o => !o)}>
        {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
      </button>

      {/* Backdrop */}
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <div className={styles.page}>
        <nav className={`${styles.inner} ${open ? styles.open : ""}`}>

          <div className={styles.logoContainer}>
            <Link to={'/'}>
              <img src="/Logos/logo-light.svg" className={styles.logo}></img>
            </Link>
          </div>
          
          {role === "Admin" && isAuth && (
            <div className={styles.grid}>
              <button className={styles.card} onClick={() => go("/admin/products")}>
                <div className={styles.cardIcon}><ShoppingBag size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Manage Products</span>
              </button>
              <button className={styles.card} onClick={() => go("/admin/add")}>
                <div className={styles.cardIcon}><Plus size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Add product</span>
              </button>
              <button className={styles.card} onClick={() => go("/admin/orders")}>
                <div className={styles.cardIcon}><ClipboardList size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Orders</span>
              </button>
              <button className={styles.card} onClick={() => handleLogout()}>
                <div className={styles.cardIcon}><LogIn size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Logout</span>
              </button>
            </div>
          )}

          {role === "Client" && isAuth && (
            <div className={styles.grid}>
              <button className={styles.card} onClick={() => go("/")}>
                <div className={styles.cardIcon}><House size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Home</span>
              </button>
              <button className={styles.card} onClick={() => go("/cart")}>
                <div className={styles.cardIcon}>
                  <ShoppingCart size={20} strokeWidth={2} />
                  {cart !== null && cart >= 0 && (<div className={styles.cartSize}>{cart}</div>)}
                </div>
                <span className={styles.cardLabel}>Cart</span>
              </button>
              <button className={styles.card} onClick={() => go("/orders")}>
                <div className={styles.cardIcon}><ClipboardList size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Orders</span>
              </button>
              <button className={styles.card} onClick={() => go('/profile')}>
                <div className={styles.cardIcon}><UserPen size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Edit Account</span>
              </button>
              <button className={styles.card} onClick={() => handleLogout()}>
                <div className={styles.cardIcon}><LogIn size={20} strokeWidth={2} /></div>
                <span className={styles.cardLabel}>Logout</span>
              </button>
            </div>
          )}

          {!isAuth &&
          <div className={styles.grid}>
            <button className={styles.card} onClick={() => go("/")}>
              <div className={styles.cardIcon}><House size={20} strokeWidth={2} /></div>
              <span className={styles.cardLabel}>Home</span>
            </button>
            <button className={styles.card} onClick={() => go("/login")}>
              <div className={styles.cardIcon}><LogIn size={20} strokeWidth={2} /></div>
              <span className={styles.cardLabel}>Login</span>
            </button>
            <button className={styles.card} onClick={() => go("/register")}>
              <div className={styles.cardIcon}><UserPlus size={20} strokeWidth={2} /></div>
              <span className={styles.cardLabel}>Register</span>
            </button>
          </div>
          }

        </nav>
      </div>
    </>
  );
}