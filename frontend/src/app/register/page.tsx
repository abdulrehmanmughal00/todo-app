"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  CheckSquare,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import styles from "./register.module.css";

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

const Register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 7) {
      toast.error("Password must be at least 7 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post<RegisterResponse>(
        "http://localhost:4000/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Account created successfully!"
        );

        setName("");
        setEmail("");
        setPassword("");

        router.push("/");
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error: unknown) {
        console.log(error);
        
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          (error.response
            ? "Registration failed. Please try again."
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
        className={styles.signupContainer}
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
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className={styles.eyebrow}>
                YOUR PRODUCTIVITY STARTS HERE
              </span>

              <h1>
                Make every
                <br />
                day <span>count.</span>
              </h1>

              <p>
                Organize your tasks, stay focused, and turn your everyday
                goals into meaningful progress.
              </p>
            </motion.div>

            <motion.div
              className={styles.benefits}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Keep all your tasks organized</span>
              </div>

              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Track your daily progress</span>
              </div>

              <div className={styles.benefit}>
                <CheckCircle2 size={19} />
                <span>Focus on what matters most</span>
              </div>
            </motion.div>
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
              <span className={styles.formEyebrow}>
                GET STARTED — ITS FREE
              </span>

              <h2>Create your account</h2>

              <p>Join Taskly and start managing your day better.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>

                <div className={styles.inputWrapper}>
                  <UserRound size={19} />

                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email address</label>

                <div className={styles.inputWrapper}>
                  <Mail size={19} />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Create a password"
                    autoComplete="new-password"
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

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <p className={styles.loginText}>
              Already have an account? <Link href="/login">Login</Link>
            </p>

            <p className={styles.terms}>
              By creating an account, you agree to our{" "}
              <span>Terms of Service</span> and <span>Privacy Policy.</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;