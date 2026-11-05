import { motion } from "framer-motion";
import {
  Circle,
  CheckCircle2,
  Trash2,
  Pencil,
} from "lucide-react";

import styles from "./TodoItem.module.css";

export interface Todo {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({
  todo,
  index,
  onToggle,
  onDelete,
}: TodoItemProps) => {
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
        onClick={() => onToggle(todo.id)}
        aria-label="Complete task"
      >
        {todo.completed ? (
          <CheckCircle2 size={22} color="#8b70e8" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      <div className={styles.todoContent}>
        <h3 className={todo.completed ? styles.completed : ""}>
          {todo.title}
        </h3>

        <span>{todo.priority} Priority</span>
      </div>

      <div className={styles.todoActions}>
        <button aria-label="Edit task">
          <Pencil size={17} />
        </button>

        <button
          aria-label="Delete task"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </motion.div>
  );
};

export default TodoItem;