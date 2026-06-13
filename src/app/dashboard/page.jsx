"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "../../services/dashboard";
import styles from "./dashboard.module.css";

function formatCurrency(value) {
  return `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;
}

const metricConfig = [
  {
    key: "total",
    label: "Total Transactions",
    helper: "Updated just now",
    accent: "slate",
    format: (stats) => stats.total,
  },
  {
    key: "pending",
    label: "Pending Requests",
    helper: "Current status",
    accent: "amber",
    format: (stats) => stats.pending,
  },
  {
    key: "pendingAmount",
    label: "Pending Amount",
    helper: "Live data",
    accent: "amber",
    format: (stats) => formatCurrency(stats.pendingAmount),
  },
  {
    key: "paid",
    label: "Paid Requests",
    helper: "System generated",
    accent: "emerald",
    format: (stats) => stats.paid,
  },
  {
    key: "paidAmount",
    label: "Paid Amount",
    helper: "Updated just now",
    accent: "emerald",
    format: (stats) => formatCurrency(stats.paidAmount),
  },
  {
    key: "totalAmount",
    label: "Total Collection",
    helper: "Live data",
    accent: "blue",
    format: (stats) => formatCurrency(stats.totalAmount),
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err?.message || "Failed to load stats."));
  }, []);

  const paidRate = stats?.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0;
  const collectionRate = stats?.totalAmount > 0 ? Math.round((stats.paidAmount / stats.totalAmount) * 100) : 0;
  const dashboardStats = stats
    ? {
        ...stats,
        paidRate,
        collectionRate,
      }
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.actions}>
          <Link href="/transactions" className={styles.actionLink}>
            View transactions
          </Link>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {metricConfig.map((metric) => {
          const accentClass = styles[metric.accent];
          const value = dashboardStats ? metric.format(dashboardStats) : "...";

          return (
            <section key={metric.key} className={`${styles.card} ${accentClass}`}>
              <div className={styles.top}>
                <p className={styles.label}>{metric.label}</p>
                <p className={`${styles.value} ${!dashboardStats ? styles.loadingValue : ""}`}>{value}</p>
              </div>
              <p className={styles.helper}>{metric.helper}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
