"use client";

import { useEffect } from "react";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.button}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.button} ${styles.confirmButton}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
