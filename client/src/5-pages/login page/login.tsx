import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { toast } from "react-toastify";
import { useAuth, type Role } from "../../2-context/authContext";
import { useCart } from "../../2-context/cartContext";
import { api } from "../../6-services/api";
import type { ApiResponse, ApiVoidResponse } from "../../7-types/response/response api";
import { getErrorMessage } from "../../8-utils/error";

interface LoginProps {
  role: Role
}

export function LoginPage(props: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { getCart, removeCart } = useCart();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = { email, password };

      if (props.role === 'Admin') {
        const response = await api.post('/admin/login', data);
        const result: ApiVoidResponse = response.data;
        login(props.role);
        removeCart();
        if (!toast.isActive('success-toast')) {
          toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
        }
        navigate('/admin/products');
      } else if (props.role === 'Client') {
        const response = await api.post('/login', data);
        const result: ApiResponse<number> = response.data;
        login(props.role);
        getCart(result.data);
        if (!toast.isActive('success-toast')) {
          toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
        }
        navigate('/');
      }
    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>

        {/* ── Left: form ── */}
        <div className={styles.formPanel}>

          {/* 👇 Drop your logo here — image, SVG, or text */}
          <div className={styles.logoContainer}>
            <img src="/Logos/logo-dark.svg" className={styles.logo}></img>
          </div>

          <h1 className={styles.heading}>
            {props.role === 'Client' ? 'Welcome back' : 'Welcome back admin'}
          </h1>
          <p className={styles.subheading}>
            {props.role === 'Client' ? 'Sign in to your account' : 'Sign in as Admin'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                minLength={8}
                maxLength={50}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>Login</button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            or
            <div className={styles.dividerLine} />
          </div>

          <button onClick={() => navigate('/register')} className={styles.btnSecondary}>
            Register
          </button>

          <div className={styles.footer}>
            {props.role === 'Client' && <Link to={'/admin/login'} className={styles.link}>Login as Admin</Link>}
            {props.role === 'Admin' && <Link to={'/login'} className={styles.link}>Login as a Client</Link>}
          </div>

        </div>

        {/* ── Right: image panel ── */}
        <div className={styles.imagePanel}>
          <img src="/Site Images/login.svg" alt="" />
        </div>

      </div>
    </div>
  )
}