// ── LoadingSpinner ──────────────────────────────────────────
import styles from "./LoadingSpinner.module.css";

export function LoadingSpinner({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={`${styles.wrap} ${className || ""}`.trim()}>
      <div className={styles.ring} />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}

// ── ErrorBanner ─────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className={styles.error}>
      <span className={styles.errorIcon}>⚠</span>
      <span>{message}</span>
    </div>
  );
}
