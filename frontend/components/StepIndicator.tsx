import styles from "./StepIndicator.module.css";

interface Props { current: number; total: number; labels: string[]; }

export default function StepIndicator({ current, total, labels }: Props) {
  return (
    <div className={styles.wrap}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "pending";
        return (
          <div key={n} className={styles.item}>
            <div className={`${styles.circle} ${styles[state]}`}>
              {state === "done" ? "✓" : n}
            </div>
            <span className={`${styles.label} ${styles[state]}`}>{labels[i]}</span>
            {n < total && <div className={`${styles.line} ${n < current ? styles.doneLine : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}
