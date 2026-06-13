"use client";

import { usePathname } from "next/navigation";
import AdminAccountMenu from "./AdminAccountMenu";
import styles from "./navbar.module.css";

const pageTitles = {
  "/dashboard": { title: "Dashboard" },
  "/transactions": { title: "Transactions" },
};

export default function Navbar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Admin", sub: "" };

  return (
    <div className={styles.navbar}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{page.title}</h2>
      </div>
      <AdminAccountMenu />
    </div>
  );
}
