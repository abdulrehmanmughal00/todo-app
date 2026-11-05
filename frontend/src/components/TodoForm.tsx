"use client";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import styles from "./TodoForm.module.css";

interface TodoFormProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
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

      <form className={styles.todoForm} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          className={styles.taskInput}
        />

        <div className={styles.formBottom}>
          <select
            className={styles.prioritySelect}
            defaultValue="Medium"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit" className={styles.addBtn}>
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TodoForm;