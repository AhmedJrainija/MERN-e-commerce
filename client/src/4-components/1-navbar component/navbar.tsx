import { Link, useNavigate } from "react-router-dom";
import { User , LogIn, LogOut, ShoppingCart } from 'lucide-react';
import styles from './Navbar.module.css'
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../2-context/authContext";
import { useDeleteAccount } from "../../3-hooks/delete account hook";
import { useLogout } from "../../3-hooks/logout hook";
import { useCart } from "../../2-context/cartContext";


export function Navbar () {
  const {isAuth, role} = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {handleLogout} = useLogout();
  const {cart} = useCart();
  const {handleDeleteAccount} = useDeleteAccount();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) { 
      //this checks if the menuRef current exists and if the element that triggered the event is the one saved in menuRef
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.mainContainer}>

      <div className={styles.logoContainer}><Link to={'/'}>SHOPPY</Link></div>

      <div className={styles.loggedContainer}>

        {isAuth && role === 'Client' &&
          <div className={styles.userContainer} ref={menuRef}> 

            <div title="Profile"><User strokeWidth={2.2} size={35} className={styles.userIcon} onClick={()=> setIsOpen(!isOpen)}/></div>

            {isOpen && 
              <div className={styles.popupMenu} onClick={()=> setIsOpen(false)}>
                <button className={styles.button} onClick={()=> navigate('/orders')}>Orders</button>
                <button className={styles.button} onClick={()=> handleLogout()}>Logout</button>
                <button className={styles.button} onClick={()=> handleDeleteAccount()}>Delete Account</button>
              </div>
            }
          </div>
        }

        <div className={styles.cartContainer}>
          <ShoppingCart size={30} strokeWidth={1.5} onClick={() => navigate('/cart')} />
          {cart !== null && cart >= 0 && (<div className={styles.cartSize}>{cart}</div>)}
        </div>

        {isAuth && role === 'Admin' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div title="Logout"><LogOut className={styles.logoutIcon} strokeWidth={2.2} size={35} onClick={() => handleLogout()} /></div>
          </div>
        )}
      </div>

      {!isAuth && 
        <div className={styles.loginContainer} title="Login">
          <LogIn className={styles.logoutIcon} strokeWidth={2.2} size={35} onClick={()=> navigate('/login')}/>
        </div>
      }
    </div>
  )
}