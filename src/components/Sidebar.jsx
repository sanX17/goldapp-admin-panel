"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, ReceiptText } from "lucide-react";
import styles from "./sidebar.module.css";

const menus = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ReceiptText, },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandBlock}>
          <h1 className={styles.brandTitle}>Gold App Admin</h1>
        </div>

        <p className={styles.sectionLabel}>Overview</p>

        <nav className={styles.nav}>
          {menus.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
              >
                <span className={styles.linkLeft}>
                  <span className={styles.iconWrap}>
                    <Icon className={styles.icon} />
                  </span>
                  <span className={styles.linkTitle}>{item.name}</span>
                </span>

                {item.badge && <span className={styles.badge}>{item.badge}</span>}
                {item.expandable && <ChevronDown className={styles.chevron} />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
