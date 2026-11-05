"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  CheckSquare,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import styles from "./login.module.css";

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

const Login = () => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifier.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes("@");

      const response = await axios.post<LoginResponse>(
        "http://localhost:4000/api/auth/login",
        {
          name: isEmail ? "" : identifier.trim(),
          email: isEmail ? identifier.trim().toLowerCase() : "",
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Login successful!");

        setIdentifier("");
        setPassword("");

        router.push("/");
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          (error.response
            ? "Login failed. Please try again."
            : "Unable to connect to server. Please try again.");

        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <motion.div
        className={styles.backgroundShape}
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={styles.loginContainer}
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Section */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <CheckSquare size={23} />
            </div>

            <span>
              Taskly<span className={styles.logoDot}>.</span>
            </span>
          </Link>

          <div className={styles.leftContent}>
            <span className={styles.eyebrow}>WELCOME BACK TO TASKLY</span>

            <h1>
              Your goals
              <br />
              are waiting<span>.</span>
            </h1>

            <p>
              Pick up where you left off. Stay organized, manage your tasks, and
              keep making progress every day.
            </p>

            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Access your personal tasks</span>
              </div>

              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Stay on top of your priorities</span>
              </div>

              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Continue your daily progress</span>
              </div>
            </div>
          </div>

          <span className={styles.leftFooter}>
            © 2026 Taskly. All rights reserved.
          </span>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <motion.div
            className={styles.formWrapper}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className={styles.formHeader}>
              <span className={styles.formEyebrow}>WELCOME BACK</span>

              <h2>Login to your account</h2>

              <p>Enter your name or email to access your Taskly account.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Name or Email */}
              <div className={styles.inputGroup}>
                <label htmlFor="identifier">Name or Email</label>

                <div className={styles.inputWrapper}>
                  <Mail size={19} />

                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    placeholder="Enter your name or email"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>

                <div className={styles.inputWrapper}>
                  <LockKeyhole size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Account"}

                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <p className={styles.signupText}>
              Dont have an account?{" "}
              <Link href="/register">Create Account</Link>
            </p>

            <p className={styles.terms}>
              By continuing, you agree to our <span>Terms of Service</span> and{" "}
              <span>Privacy Policy.</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
