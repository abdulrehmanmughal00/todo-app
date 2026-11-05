"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, UserRound, LogOut } from "lucide-react";

import styles from "./Header.module.css";

interface User {
  name: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: User;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/get-user",
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data: ApiResponse = await response.json();

        if (response.ok && data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("User fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Logout user
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <CheckSquare size={22} />
        </div>

        <span>
          Taskly<span className={styles.logoDot}>.</span>
        </span>
      </Link>

      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/#tasks">My Tasks</Link>
      </nav>

      <div className={styles.authArea}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="profile"
                className={styles.profile}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.avatar}>
                  <UserRound size={19} />
                </div>

                <span>{user.name}</span>

                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  <LogOut size={17} />
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                className={styles.authButtons}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link href="/login" className={styles.loginBtn}>
                  Login
                </Link>

                <Link href="/register" className={styles.signupBtn}>
                  Sign Up
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
