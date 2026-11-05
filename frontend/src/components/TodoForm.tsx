
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

import styles from "./TodoForm.module.css";

interface TodoFormProps {
  onSubmit?: () => void;
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    "Medium"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/api/todo/create",
        {
          title: title.trim(),
          priority,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Task created successfully!"
      );

      setTitle("");
      setPriority("Medium");

      onSubmit?.();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please login to create a task.");
          router.push("/login");
          return;
        }

        toast.error(
          error.response?.data?.message || "Unable to create task."
        );
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.formCard}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className={styles.formHeading}>
        <span className={styles.eyebrow}>
          <Sparkles size={14} />
          STAY PRODUCTIVE
        </span>

        <h2>Create a new task</h2>

        <p>Small steps lead to big achievements.</p>
      </div>

      <form className={styles.todoForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          className={styles.taskInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          maxLength={150}
        />

        <div className={styles.formBottom}>
          <select
            className={styles.prioritySelect}
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "Low" | "Medium" | "High")
            }
            disabled={loading}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            type="submit"
            className={styles.addBtn}
            disabled={loading}
          >
            <Plus size={18} />
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TodoForm;
