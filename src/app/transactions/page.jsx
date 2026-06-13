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

function getPaymentStatusValue(item) {
  const rawStatus =
    item.paymentStatus ??
    item.payment_status ??
    item.payment?.status ??
    item.paymentDetails?.status ??
    item.status;

  const normalized = String(rawStatus ?? "").trim().toUpperCase();

  if (normalized === "SUCCESS" || normalized === "SUCCESSFUL") {
    return "PAID";
  }

  return normalized;
}

function getMemberIdValue(item) {
  if (item.memberId) return String(item.memberId);

  if (Array.isArray(item.schemes)) {
    const schemeMemberIds = item.schemes
      .map((scheme) => scheme?.memberId)
      .filter(Boolean);

    if (schemeMemberIds.length > 0) {
      return schemeMemberIds.join(", ");
    }
  }

  return String(item.memCode ?? "");
}

function getTransactionIdValue(item) {
  return String(item.transactionId ?? "");
}

export default function Page() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = listenTransactions("ALL", setData);
    return () => unsub();
  }, [refreshKey]);

  const sortedData = [...data].sort(
    (a, b) => getTransactionTime(b) - getTransactionTime(a)
  );

  const filtered = sortedData.filter(
    (item) => {
      const normalizedSearch = search.toLowerCase();
      const transactionTime = getTransactionTime(item);
      const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
      const toTime = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null;
      const matchesSearch =
        item.userPhone?.includes(search) ||
        item.userName?.toLowerCase().includes(normalizedSearch) ||
        getMemberIdValue(item).toLowerCase().includes(normalizedSearch) ||
        getTransactionIdValue(item).toLowerCase().includes(normalizedSearch);
      const matchesFilter =
        filter === "ALL" || getPaymentStatusValue(item) === filter;
      const matchesDateRange =
        (!fromTime || transactionTime >= fromTime) &&
        (!toTime || transactionTime <= toTime);

      return matchesSearch && matchesFilter && matchesDateRange;
    }
  );

  const counts = {
    total: data.length,
    paid: data.filter((d) => getPaymentStatusValue(d) === "PAID").length,
    pending: data.filter((d) => getPaymentStatusValue(d) === "PENDING").length,
  };

  const totalPaidAmount = data.reduce(
    (sum, item) =>
      getPaymentStatusValue(item) === "PAID" ? sum + (item.totalAmount || 0) : sum,
    0
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((current) => current + 1);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyPanel}>
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
            <p className={styles.statLabel}>Total Paid Amount</p>
            <p className={styles.statValue}>{"\u20B9"}{totalPaidAmount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchArea}>
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className={styles.filterArea}>
            <div className={styles.filterRow}>
              <div className={styles.filterControls}>
                <FilterButtons filter={filter} setFilter={setFilter} />

                <div className={styles.dateFilters}>
                  <div className={styles.dateField}>
                    <label htmlFor="from-date" className={styles.dateLabel}>From</label>
                    <input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(event) => setFromDate(event.target.value)}
                      className={styles.dateInput}
                    />
                  </div>

                  <div className={styles.dateField}>
                    <label htmlFor="to-date" className={styles.dateLabel}>To</label>
                    <input
                      id="to-date"
                      type="date"
                      value={toDate}
                      onChange={(event) => setToDate(event.target.value)}
                      className={styles.dateInput}
                    />
                  </div>

                  {(fromDate || toDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFromDate("");
                        setToDate("");
                      }}
                      className={styles.clearDatesButton}
                    >
                      Clear dates
                    </button>
                  )}
                </div>
              </div>

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
      </div>

      <div className={styles.tableArea}>
        <Table data={filtered} />
      </div>
    </div>
  );
}
