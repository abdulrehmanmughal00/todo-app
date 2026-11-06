
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ClipboardList, LogOut, UserRound } from "lucide-react";

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
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "http://localhost:4000/api/auth/get-user",
        { withCredentials: true }
      );

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);

      if (axios.isAxiosError(error)) {
        console.error(
          "Fetch user error:",
          error.response?.data?.message || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    axios
      .get<ApiResponse>("http://localhost:4000/api/auth/get-user", {
        withCredentials: true,
      })
      .then((response) => {
        if (!isActive) return;

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (isActive) setUser(null);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    const handleLogin = () => {
      fetchUser();
    };

    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("user-login", handleLogin);
    window.addEventListener("user-logout", handleLogout);

    return () => {
      isActive = false;
      window.removeEventListener("user-login", handleLogin);
      window.removeEventListener("user-logout", handleLogout);
    };
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
      window.dispatchEvent(new Event("user-logout"));
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) return null;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoIcon}>
          <ClipboardList size={21} />
        </span>

        <span>
          Taskly<span className={styles.logoDot}>.</span>
        </span>
      </Link>

 
      <div className={styles.authButtons}>
        {user ? (
          <>
            <div className={styles.profile}>
              <span className={styles.avatar}>
                {user.name?.charAt(0).toUpperCase() || (
                  <UserRound size={18} />
                )}
              </span>
              <span>{user.name}</span>
            </div>

            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              <LogOut size={16} />
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>

            <Link href="/register" className={styles.signupBtn}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
