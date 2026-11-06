
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";

import TodoItem from "./TodoItem";
import type { Todo, TodoUpdate } from "./TodoItem";

import styles from "./TodoList.module.css";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: TodoUpdate) => Promise<void>;
}

const TodoList = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) => {
  const completedCount = todos.filter(
    (todo) => todo.isCompleted
  ).length;

  return (
    <motion.section
      className={styles.listSection}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.listHeading}>
        <div>
          <h2>Your Tasks</h2>

          <p>
            {completedCount} of {todos.length} tasks completed
          </p>
        </div>

        <span className={styles.taskCount}>
          {todos.length} {todos.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>

      <div className={styles.todos}>
        <AnimatePresence mode="popLayout">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          ) : (
            <motion.div
              key="empty-state"
              className={styles.emptyState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ClipboardList size={34} />

              <h3>No tasks yet</h3>

              <p>
                Your task list is empty. Add a task to get started.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default TodoList;
