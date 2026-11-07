import express from "express";
import todoController from "../controllers/todo.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create", authMiddleware, todoController.createTodo);
router.get("/get-todo", authMiddleware, todoController.getTodos);
router.delete("/delete/:id", authMiddleware, todoController.deleteTodo);
router.patch("/edit/:id", authMiddleware, todoController.editTodo);
router.patch("/toggle/:id", authMiddleware, todoController.toggleTodo);
export default router;
