import styles from './EmptyPage.module.css';


interface EmptyProps {
  name: string,
  message: string
}

export function Empty(props: EmptyProps) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <img src={`/Empty Logos/empty-${props.name}.svg`} className={styles.image} />
        <h1 className={styles.title}>{props.message}</h1>
      </div>
    </div>
  );
}