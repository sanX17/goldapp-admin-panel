"use client";

import styles from "./FilterButtons.module.css";

const items = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
];

export default function FilterButtons({ filter, setFilter }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Filter</p>
      <div className={styles.buttons}>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            disabled={filter === item.value}
            className={`${styles.button} ${filter === item.value ? styles.buttonActive : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
