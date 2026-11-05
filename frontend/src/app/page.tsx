"use client";
import Header from "@/components/Header";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

import type { Todo } from "@/components/TodoItem";

import styles from "./page.module.css";

function Page() {
  // Demo UI data

  const isAuthenticated: boolean = true;

  const username: string = "Abdul";

  const todos: Todo[] = [
    {
      id: 1,
      title: "Complete backend authentication",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Practice MongoDB queries",
      priority: "Medium",
      completed: true,
    },
    {
      id: 3,
      title: "Build Todo application UI",
      priority: "High",
      completed: false,
    },
  ];

  return (
    <div className={styles.app}>
      <Header isAuthenticated={isAuthenticated} username={username} />

      <main className={styles.container} id="home">
        <div className={styles.hero}>
          <h1>
            Make today <span>count.</span>
          </h1>

          <p>Organize your work, manage your time, and get things done.</p>
        </div>

        <TodoForm />

        <TodoList
          todos={todos}
          onToggle={(id) => console.log("Toggle:", id)}
          onDelete={(id) => console.log("Delete:", id)}
        />
      </main>

      <footer className={styles.footer}>
        <span>Made for better productivity.</span>
        <span>Taskly © 2026</span>
      </footer>
    </div>
  );
}

export default Page;
