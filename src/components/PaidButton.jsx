"use client";

import { useState } from "react";
import { markPaid } from "../services/transactions";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";
import styles from "./ActionButton.module.css";

export default function PaidButton({ id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await markPaid(id);
      toast.success("Marked as paid");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={styles.button}>
        Mark Paid
      </button>
      <ConfirmModal
        open={open}
        title="Mark as Paid?"
        message="This will update the transaction status to Paid."
        confirmLabel={loading ? "Processing..." : "Yes, mark paid"}
        onConfirm={loading ? undefined : confirm}
        onCancel={() => !loading && setOpen(false)}
      />
    </>
  );
}
