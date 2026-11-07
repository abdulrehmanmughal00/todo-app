import type { Request, Response } from "express";
import todoModel from "../models/todo.model.js";
import { Types } from "mongoose";


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
const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const todos = await todoModel.find({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    console.log("Get todos error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Todo ID",
      });
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deletedTodo = await todoModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete Todo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




const editTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, priority, isCompleted } = req.body;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Todo ID",
      });
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      title === undefined &&
      priority === undefined &&
      isCompleted === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      if (title.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Title cannot exceed 100 characters",
        });
      }
    }

    if (
      priority !== undefined &&
      !["Low", "Medium", "High"].includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    if (
      isCompleted !== undefined &&
      typeof isCompleted !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean",
      });
    }

    const updatedTodo = await todoModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(priority !== undefined && { priority }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Edit Todo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const toggleTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { isCompleted } = req.body;

    // Check Todo ID
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Todo ID",
      });
    }

    // Check User ID
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check isCompleted
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be true or false",
      });
    }

    // Update Todo
    const updatedTodo = await todoModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      },
      {
        isCompleted,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todo status updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Toggle Todo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default { createTodo,getTodos ,deleteTodo, editTodo,toggleTodo};
