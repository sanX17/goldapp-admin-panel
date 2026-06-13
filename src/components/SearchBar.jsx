"use client";

import styles from "./SearchBar.module.css";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="transaction-search" className={styles.label}>Search</label>
      <div className={styles.row}>
        <input
          id="transaction-search"
          placeholder="Search by name, phone, member ID, or transaction ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className={styles.clearButton}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
