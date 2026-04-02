"use client";
import { useEffect, useState } from "react";
import styles from "./DisclaimerModal.module.css";

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("disclaimer_seen")) setOpen(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem("disclaimer_seen", "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⚕️</div>
        <h2 className={styles.title}>Medical Disclaimer</h2>
        <p className={styles.body}>
          HeartPredict is a <strong>student research project</strong> built for
          academic purposes. Predictions are based on a machine-learning model
          trained on clinical data and are <strong>not a diagnosis</strong>.
          Always consult a licensed healthcare professional for medical advice.
        </p>
        <button className={`btn btn-primary ${styles.btn}`} onClick={dismiss}>
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}
