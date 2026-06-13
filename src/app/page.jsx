"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import styles from "./login-screen.module.css";

export default function Page() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!code || !id) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyCode: code,
          companyId: id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.replace("/dashboard");
      } else {
        setError(result?.message || "Invalid company code or ID. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.iconWrap}>
              <UserCircle2 className={styles.icon} />
            </div>
            <h1 className={styles.title}>Gold App Admin</h1>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="company-code" className={styles.label}>Company Code</label>
              <input
                id="company-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company-id" className={styles.label}>Company ID</label>
              <input
                id="company-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.input}
              />
            </div>

            <button type="button" onClick={handleLogin} disabled={loading} className={styles.button}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className={styles.footer}>Secure access for authorized team members only.</p>
        </div>
      </div>
    </div>
  );
}
