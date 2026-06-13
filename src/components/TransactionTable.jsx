"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import styles from "./TransactionTable.module.css";

function toDate(value) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (typeof value === "number") return new Date(value);
  return null;
}

function formatDate(value) {
  const d = toDate(value);
  if (!d) return "--";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(value) {
  const d = toDate(value);
  if (!d) return null;
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatCurrency(value) {
  if (value == null) return "--";
  return `\u20B9${Number(value).toLocaleString("en-IN")}`;
}

function getMemberId(item) {
  if (item.memberId) return item.memberId;
  if (Array.isArray(item.schemes)) {
    const schemeMemberIds = item.schemes
      .map((scheme) => scheme?.memberId)
      .filter(Boolean);

    if (schemeMemberIds.length > 0) {
      return schemeMemberIds.join(", ");
    }
  }
  return item.memCode || "--";
}

function getTransactionId(item) {
  return item.transactionId || "--";
}

function getPaymentStatus(item) {
  return item.paymentStatus || "--";
}

export default function Table({ data }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyTransactionId = async (rowId, transactionId) => {
    if (!transactionId || transactionId === "--") return;

    try {
      await navigator.clipboard.writeText(transactionId);
      setCopiedId(rowId);
      window.setTimeout(() => {
        setCopiedId((current) => (current === rowId ? null : current));
      }, 1500);
    } catch {
      setCopiedId(null);
    }
  };

  if (data.length === 0) {
    return (
      <section className={`${styles.section} ${styles.empty}`}>
        <p className={styles.emptyText}>No transactions found.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <p className={styles.headerCell}>Name</p>
        <p className={styles.headerCell}>Phone</p>
        <p className={styles.headerCell}>Member ID</p>
        <p className={styles.headerCell}>Transaction ID</p>
        <p className={styles.headerCell}>Payment Status</p>
        <p className={styles.headerCell}>Amount</p>
        <p className={styles.headerCell}>Sync Status</p>
        <p className={styles.headerCell}>Date</p>
      </div>

      <div className={styles.rows}>
        {data.map((item) => {
          const raw = item.createdAt ?? item.timestamp ?? item.requestedAt;
          const date = formatDate(raw);
          const time = formatTime(raw);
          const paidDate = item.status === "PAID" && item.paidAt ? formatDate(item.paidAt) : null;
          const memberId = getMemberId(item);
          const transactionId = getTransactionId(item);
          const paymentStatus = getPaymentStatus(item);

          return (
            <div key={item.id} className={styles.row}>
              <div>
                <p className={styles.fieldLabel}>Name</p>
                <p className={styles.fieldValue}>{item.userName || "--"}</p>
              </div>
              <div>
                <p className={styles.fieldLabel}>Phone</p>
                <p className={styles.fieldValue}>{item.userPhone || "--"}</p>
              </div>
              <div>
                <p className={styles.fieldLabel}>Member ID</p>
                <p className={styles.fieldValue}>{memberId}</p>
              </div>
              <div>
                <p className={styles.fieldLabel}>Transaction ID</p>
                <div className={styles.transactionIdRow}>
                  <p className={styles.fieldValue}>{transactionId}</p>
                  {transactionId !== "--" && (
                    <button
                      type="button"
                      className={styles.copyButton}
                      onClick={() => handleCopyTransactionId(item.id, transactionId)}
                      aria-label={`Copy transaction ID ${transactionId}`}
                      title={copiedId === item.id ? "Copied" : "Copy transaction ID"}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className={styles.fieldLabel}>Payment Status</p>
                <p className={`${styles.fieldValue} ${styles.statusPaid}`}>{paymentStatus}</p>
              </div>
              <div>
                <p className={styles.fieldLabel}>Amount</p>
                <p className={styles.fieldValue}>{formatCurrency(item.totalAmount)}</p>
              </div>
              <div>
                <p className={styles.fieldLabel}>Sync Status</p>
                <p className={`${styles.fieldValue} ${item.status === "PAID" ? styles.statusPaid : styles.statusPending}`}>
                  {item.status}
                </p>
                {paidDate && <p className={styles.sectionMeta}>Paid on {paidDate}</p>}
              </div>
              <div>
                <p className={styles.fieldLabel}>Date</p>
                <div className={styles.dateTimeCell}>
                  <p className={styles.fieldValue}>{date}</p>
                  {time && <p className={styles.timeValue}>{time}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
