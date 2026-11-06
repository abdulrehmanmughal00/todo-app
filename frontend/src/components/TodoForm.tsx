"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { ClipboardList, Plus } from "lucide-react";

import styles from "./TodoForm.module.css";

interface TodoFormProps {
  onSubmit: () => Promise<void>;
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/api/todo/create",
        {
          title: title.trim(),
          priority,
        },
        { withCredentials: true },
      );

      setTitle("");
      setPriority("Medium");

      await onSubmit();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Create todo error:",
          error.response?.data?.message || error.message,
        );
      } else {
        console.error("Something went wrong:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.formHeading}>
        <span className={styles.eyebrow}>
          <ClipboardList size={14} />
          NEW TASK
        </span>

        <h2>Create a task</h2>
        <p>Write down what you need to get done.</p>
      </div>

      <form className={styles.todoForm} onSubmit={handleSubmit}>
        <input
          className={styles.taskInput}
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
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
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <button
            className={styles.addBtn}
            type="submit"
            disabled={loading || !title.trim()}
          >
            <Plus size={18} />
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
