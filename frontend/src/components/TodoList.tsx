"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";

import TodoItem from "./TodoItem";
import type { Todo } from "./TodoItem";

import styles from "./TodoList.module.css";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoList = ({
  todos,
  onToggle,
  onDelete,
}: TodoListProps) => {
  return (
    <motion.section
      className={styles.listSection}
      id="tasks"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className={styles.listHeading}>
        <div>
          <h2>My Tasks</h2>
          <p>Keep track of what matters.</p>
        </div>

        <span className={styles.taskCount}>
          {todos.length} Tasks
        </span>
      </div>

      <div className={styles.todos}>
        <AnimatePresence mode="popLayout">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ClipboardList size={42} />

              <h3>No tasks yet</h3>

              <p>Your tasks will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default TodoList;