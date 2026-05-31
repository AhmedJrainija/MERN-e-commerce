import { useEffect, useRef, useState } from "react"
import styles from "./Profile.module.css";
import { toast, type Id } from "react-toastify";
import { api } from "../../../6-services/api";
import type { ApiResponse, ApiVoidResponse } from "../../../7-types/response/response api";
import { getErrorMessage } from "../../../8-utils/error";
import { useDeleteAccount } from "../../../3-hooks/delete account hook";

export function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [click, setClick] = useState(0);
  const {handleDeleteAccount} = useDeleteAccount();
  const toastId = useRef<Id | undefined>(undefined);

  interface AccountInfoDTO {
    firstName: string,
    lastName: string,
    email: string
  }

  useEffect(() => {
    async function findProduct() {
      try {
        const response = await api.get('/profile');
        const result: ApiResponse<AccountInfoDTO> = response.data;
        const account = result.data;
        setFirstName(account.firstName);
        setLastName(account.lastName);
        setEmail(account.email);
      } catch (error) {
        if (!toast.isActive('error-toast')) {
          toast.error(getErrorMessage(error), { toastId: 'error-toast'});
        }
      }
    }
    findProduct();
  }, [click]);

  const handleSubmit = async () => {
    try {
      const data = { firstName, lastName, email, password, newPassword, confirmPassword };

      const response = await api.patch('/profile', data);

      const result: ApiVoidResponse = response.data;

      if (!toast.isActive('success-toast')) {
        toast.success(result.message, { toastId: 'success-toast', autoClose:1000});
      }

      setClick(prev => prev +1);

    } catch (error) {
      if (!toast.isActive('error-toast')) {
        toast.error(getErrorMessage(error), { toastId: 'error-toast'});
      }
    }
  }

  const updateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (toast.isActive('update-account')) return;

    toastId.current = toast(
      <div className={styles.toastBody}>
        <p className={styles.toastText}>Save modification?</p>
        <div className={styles.toastActions}>
          <button className={styles.toastConfirm} onClick={() => { handleSubmit(); toast.dismiss('update-account'); }}>
            Confirm
          </button>
          <button className={styles.toastCancel} onClick={() => toast.dismiss('update-account')}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, toastId: 'update-account', position:'top-center' }
    );
  };

  const deleteAccount = () => {
    if (toast.isActive('delete-account')) return;

    toastId.current = toast(
      <div className={styles.toastBody}>
        <p className={styles.toastText}>Delete the account?</p>
        <div className={styles.toastActions}>
          <button className={styles.toastConfirm} onClick={() => { handleDeleteAccount(); toast.dismiss('delete-account'); }}>
            Confirm
          </button>
          <button className={styles.toastCancel} onClick={() => toast.dismiss('delete-account')}>
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, toastId: 'delete-account', position:'top-center' }
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>

        <div className={styles.formPanel}>

          <div className={styles.logoContainer}>
            <img src="/Logos/logo-dark.svg" className={styles.logo}></img>
          </div>

          <h1 className={styles.heading}>Edit Account</h1>

          <form onSubmit={updateAccount}>

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

            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                minLength={8}
                maxLength={50}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                minLength={8}
                maxLength={50}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.btnPrimary}>Save edit</button>
            
            <button type="button" className={styles.btnDelete} onClick={deleteAccount}>
              Delete account
            </button>

          </form>

        </div>

        {/* ── Right: image panel ── */}
        <div className={styles.imagePanel}>
          <img src="/Site Images/login.svg" alt="" />
        </div>

      </div>
    </div>
  )
}