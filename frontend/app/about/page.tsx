import styles from "./page.module.css";
import { getHealth, getModelInfo } from "@/lib/api";
import { Suspense } from "react";

export const revalidate = 60; // ISR cache

export default async function AboutPage() {
  const [health, modelInfo] = await Promise.all([
    getHealth().catch(() => null),
    getModelInfo().catch(() => null),
  ]);

  return (
    <div className="container min-h-[80vh] py-16">
      <div className={styles.page}>
        
        {/* ── Overview ── */}
        <section className={`${styles.section} gravity-item`}>
          <h1 className={styles.h1}>About Heart<span className="text-googleBlue">Predict</span></h1>
          <p className={styles.body}>
            This application is designed as an educational tool to demonstrate the
            capabilities of machine learning in the medical domain. It utilizes a 
            <strong> {modelInfo?.model_name || "Multi-Class Naive Bayes"} </strong> model 
            to estimate the probability of various cardiovascular conditions based on 
            standard clinical indicators.
          </p>
          <div className={`${styles.warn} mt-6`}>
            <strong>Important Disclaimer:</strong> This system provides an estimated
            risk profile for informational purposes only. It is not an alternative to
            professional medical evaluation, diagnosis, or treatment.
          </div>
        </section>

        {/* ── System Status ── */}
        <div className={styles.grid2}>
          <section className={`${styles.card} gravity-item`}>
            <h2 className={styles.h2}>System Status</h2>
            <ul className={styles.list}>
              <li>
                <span className={styles.label}>Frontend:</span> 
                <span className={styles.val}>Active (Next.js)</span>
              </li>
              <li>
                <span className={styles.label}>Backend API (Go):</span> 
                {health ? (
                  <span className={`${styles.val} text-googleGreen`}>Online ({health.uptime})</span>
                ) : (
                  <span className={`${styles.val} text-googleRed`}>Offline</span>
                )}
              </li>
              <li>
                <span className={styles.label}>Inference Engine:</span> 
                <span className={styles.val}>Python 3.11</span>
              </li>
            </ul>
          </section>

          {/* ── ML Model ── */}
          <section className={`${styles.card} gravity-item`}>
             <h2 className={styles.h2}>Model Specifications</h2>
             {modelInfo ? (
               <ul className={styles.list}>
                  <li>
                    <span className={styles.label}>Architecture:</span> 
                    <span className={styles.val}>{modelInfo.model_name}</span>
                  </li>
                  <li>
                    <span className={styles.label}>Classes:</span> 
                    <span className={styles.val}>{modelInfo.n_classes}</span>
                  </li>
                  <li>
                    <span className={styles.label}>Global Accuracy:</span> 
                    <span className={styles.val}>88.98%</span>
                  </li>
                  <li>
                    <span className={styles.label}>Trained On:</span> 
                    <span className={styles.val}>{modelInfo.trained_on}</span>
                  </li>
                  <li>
                    <span className={styles.label}>Last Updated:</span> 
                    <span className={styles.val}>{modelInfo.training_date}</span>
                  </li>
               </ul>
             ) : (
               <div className={styles.body}>Model metadata currently unavailable.</div>
             )}
          </section>
        </div>

      </div>
    </div>
  );
}
