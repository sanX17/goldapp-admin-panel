"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import styles from "./navbar.module.css";

export default function AdminAccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className={styles.menuArea} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={styles.menuButton}
        aria-expanded={open}
      >
        <span className={styles.menuButtonRow}>
          <span className={styles.menuIconWrap}>
            <User className={styles.menuIcon} />
          </span>
          <span className={styles.menuValue}>Admin Account</span>
          <ChevronDown className={`${styles.menuChevron} ${open ? styles.menuChevronOpen : ""}`} />
        </span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <p className={styles.dropdownLabel}>Signed in as</p>
          <p className={styles.dropdownValue}>Admin Account</p>
          <p className={styles.dropdownMeta}>Administrator access</p>
          <hr className={styles.divider} />
          <button type="button" onClick={handleLogout} className={styles.signOut}>
            <LogOut className={styles.signOutIcon} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
