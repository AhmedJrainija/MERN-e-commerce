import {type FallbackProps } from "react-error-boundary";
import styles from "./ErrorBoundary.module.css";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.card}>
        <p className={styles.title}>Something went wrong</p>
        <pre className={styles.message}>
          {error instanceof Error && error.message}
        </pre>
        <button className={styles.btn} onClick={resetErrorBoundary}>
          Try again
        </button>
      </div>
    </div>
  );
}