"use client";

import { useState } from "react";
import { markPending } from "../services/transactions";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";
import styles from "./ActionButton.module.css";

export default function PendingButton({ id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await markPending(id);
      toast.success("Reverted to pending");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={styles.button}>
        Revert to Pending
      </button>
      <ConfirmModal
        open={open}
        title="Revert to Pending?"
        message="This will change the transaction status back to Pending."
        confirmLabel={loading ? "Processing..." : "Yes, revert"}
        onConfirm={loading ? undefined : confirm}
        onCancel={() => !loading && setOpen(false)}
      />
    </>
  );
}
