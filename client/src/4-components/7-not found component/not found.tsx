import styles from './NotFound.module.css';

export function NotFound() {
  const message = new URLSearchParams(window.location.search).get("message") || "Page not found";
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img src="/Logos/favicon.svg" className={styles.image} />
        <h1 className={styles.title}>{message}</h1>
        <p className={styles.subtitle}>We can't seem to find the page you are looking for.</p>
        <button
          className={styles.btn}
          onClick={() => window.location.href = '/'}
        >
          Home
        </button>
      </div>
    </div>
  );
}