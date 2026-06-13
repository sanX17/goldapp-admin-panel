"use client";

import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import FilterButtons from "../../components/FilterButtons";
import Table from "../../components/TransactionTable";
import { listenTransactions } from "../../services/transactions";
import styles from "./transactions.module.css";

function getTransactionTime(item) {
  const value = item.createdAt ?? item.timestamp ?? item.requestedAt;

  if (!value) return 0;
  if (typeof value === "number") return value;
  if (value?.toDate) return value.toDate().getTime();

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function Page() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = listenTransactions(filter, setData);
    return () => unsub();
  }, [filter, refreshKey]);

  const sortedData = [...data].sort(
    (a, b) => getTransactionTime(b) - getTransactionTime(a)
  );

  const filtered = sortedData.filter(
    (item) =>
      item.userPhone?.includes(search) ||
      item.userName?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: data.length,
    paid: data.filter((d) => d.status === "PAID").length,
    pending: data.filter((d) => d.status === "PENDING").length,
  };

  const totalValue = data.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((current) => current + 1);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Transactions</p>
          <p className={styles.statValue}>{counts.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending</p>
          <p className={styles.statValue}>{counts.pending}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Paid</p>
          <p className={styles.statValue}>{counts.paid}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Volume</p>
          <p className={styles.statValue}>{"\u20B9"}{totalValue.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchArea}>
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        <div className={styles.filterArea}>
          <div className={styles.filterRow}>
            <FilterButtons filter={filter} setFilter={setFilter} />
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className={styles.refreshButton}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <Table data={filtered} />
    </div>
  );
}
