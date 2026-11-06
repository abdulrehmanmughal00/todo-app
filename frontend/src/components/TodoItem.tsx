
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Circle,
  CheckCircle2,
  Trash2,
  Pencil,
  Save,
  X,
} from "lucide-react";

import styles from "./TodoItem.module.css";

export interface Todo {
  _id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  isCompleted: boolean;
}

export interface TodoUpdate {
  title: string;
  priority: "Low" | "Medium" | "High";
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: TodoUpdate) => Promise<void>;
}

const TodoItem = ({
  todo,
  index,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState<TodoUpdate["priority"]>(
    todo.priority
  );
  const [saving, setSaving] = useState(false);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setSaving(true);

      await onEdit(todo._id, {
        title: title.trim(),
        priority,
      });

      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setTitle(todo.title);
    setPriority(todo.priority);
    setIsEditing(false);
  };

  return (
    <motion.div
      className={styles.todoItem}
      layout
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
      }}
      whileHover={{ scale: 1.015 }}
    >
      <button
        className={styles.checkBtn}
        onClick={() => onToggle(todo._id)}
        aria-label="Toggle task completion"
        disabled={isEditing}
        type="button"
      >
        {todo.isCompleted ? (
          <CheckCircle2 size={22} color="#8b70e8" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      {isEditing ? (
        <form
          onSubmit={handleEdit}
          style={{
            display: "flex",
            flex: 1,
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            disabled={saving}
            autoFocus
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TodoUpdate["priority"])
            }
            disabled={saving}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={cancelEdit}
            disabled={saving}
          >
            <X size={17} />
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className={styles.todoContent}>
            <h3 className={todo.isCompleted ? styles.completed : ""}>
              {todo.title}
            </h3>

            <span>{todo.priority} Priority</span>
          </div>

          <div className={styles.todoActions}>
            <button
              aria-label="Edit task"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={17} />
            </button>

            <button
              aria-label="Delete task"
              type="button"
              onClick={() => onDelete(todo._id)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TodoItem;
