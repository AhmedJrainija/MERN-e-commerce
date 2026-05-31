import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { toast } from "react-toastify";
import { api } from "../../../6-services/api";
import type { ApiVoidResponse } from "../../../7-types/response/response api";
import { getErrorMessage } from "../../../8-utils/error";

export function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = { firstName, lastName, email, password };

      const response = await api.post('/register', data);

      const result: ApiVoidResponse = response.data;

      if (!toast.isActive('success-toast')) {
        toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
      }

      navigate('/login');

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

          <h1 className={styles.heading}>Create account</h1>
          <p className={styles.subheading}>Sign up to get started</p>

          <form onSubmit={handleSubmit}>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  minLength={3}
                  maxLength={50}
                  pattern="[a-zA-Z\s]+"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Last name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  minLength={3}
                  maxLength={50}
                  pattern="[a-zA-Z\s]+"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="Enter email"
                value={email}
                pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter password"
                value={password}
                minLength={8}
                maxLength={50}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>Register</button>

          </form>

          <div className={styles.footer}>
            <Link to="/login" className={styles.link}>Already have an account? Sign in</Link>
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