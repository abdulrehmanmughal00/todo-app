import type { Request, Response } from "express";
import todoModel from "../models/todo.model.js";
const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, priority } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }
    const newTodo = await todoModel.create({
      title,
      priority,
      userId: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo: newTodo,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default { createTodo };
