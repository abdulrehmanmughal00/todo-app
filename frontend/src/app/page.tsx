"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import Header from "@/components/Header";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

import type { Todo } from "@/components/TodoItem";

import styles from "./page.module.css";

function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prevent old requests from updating state
  const requestVersion = useRef(0);

  // GET Todos
  const fetchTodos = useCallback(async () => {
    const currentRequest = ++requestVersion.current;

    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:4000/api/todo/get-todo",
        { withCredentials: true },
      );

      if (currentRequest !== requestVersion.current) return;

      setTodos(response.data.todos || []);
      setIsLoggedIn(true);
    } catch (error) {
      if (currentRequest !== requestVersion.current) return;

      setTodos([]);
      setIsLoggedIn(false);

      if (axios.isAxiosError(error)) {
        console.log(
          "Get todos error:",
          error.response?.data?.message || error.message,
        );
      }
    } finally {
      if (currentRequest === requestVersion.current) {
        setLoading(false);
      }
    }
  }, []);

  // Initial GET and login/logout events
  useEffect(() => {
    let isActive = true;
    const initialRequest = ++requestVersion.current;

    axios
      .get("http://localhost:4000/api/todo/get-todo", {
        withCredentials: true,
      })
      .then((response) => {
        if (!isActive || initialRequest !== requestVersion.current) return;

        setTodos(response.data.todos || []);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        if (!isActive || initialRequest !== requestVersion.current) return;

        setTodos([]);
        setIsLoggedIn(false);

        if (axios.isAxiosError(error)) {
          console.log(
            "Get todos error:",
            error.response?.data?.message || error.message,
          );
        }
      })
      .finally(() => {
        if (isActive && initialRequest === requestVersion.current) {
          setLoading(false);
        }
      });

    const handleLogout = () => {
      // Invalidate any pending GET request
      requestVersion.current++;

      setTodos([]);
      setIsLoggedIn(false);
      setLoading(false);
    };

    const handleLogin = () => {
      fetchTodos();
    };

    window.addEventListener("user-logout", handleLogout);
    window.addEventListener("user-login", handleLogin);

    return () => {
      isActive = false;
      requestVersion.current++;

      window.removeEventListener("user-logout", handleLogout);
      window.removeEventListener("user-login", handleLogin);
    };
  }, [fetchTodos]);

  // Done / Undo
  const handleToggle = async (id: string) => {
    try {
      const todo = todos.find((item) => item._id === id);
      if (!todo) return;

      await axios.patch(
        `http://localhost:4000/api/todo/toggle/${id}`,
        { isCompleted: !todo.isCompleted },
        { withCredentials: true },
      );

      await fetchTodos();
    } catch (error) {
      console.error("Toggle todo error:", error);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/todo/delete/${id}`, {
        withCredentials: true,
      });

      await fetchTodos();
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  // Edit
  const handleEdit = async (
    id: string,
    data: {
      title: string;
      priority: "Low" | "Medium" | "High";
    },
  ) => {
    try {
      await axios.patch(`http://localhost:4000/api/todo/edit/${id}`, data, {
        withCredentials: true,
      });

      await fetchTodos();
    } catch (error) {
      console.error("Edit todo error:", error);
      throw error;
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.container}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>YOUR DAY, ORGANIZED</span>

          <h1>
            Make today <span>count.</span>
          </h1>

          <p>Organize your work, manage your time, and get things done.</p>
        </section>

        <section className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.loader} />
              <p>Loading your tasks...</p>
            </div>
          ) : isLoggedIn ? (
            <>
              <TodoForm onSubmit={fetchTodos} />

              <TodoList
                todos={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </>
          ) : (
            <div className={styles.loginPrompt}>
              <div className={styles.promptIcon}>✦</div>

              <h2>Your tasks are waiting.</h2>

              <p>Login to manage your tasks and keep your day organized.</p>
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Made for better productivity.</span>
        <span>Taskly © 2026</span>
      </footer>
    </div>
  );
}

export default Page;
