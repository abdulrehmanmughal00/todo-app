import mongoose from "mongoose";

interface ITodo {
  title: string;
  priority: "Low" | "Medium" | "High";
  isCompleted: boolean;
  userId: mongoose.Types.ObjectId;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const todo = mongoose.model<ITodo>("Todo", todoSchema);

export default todo;
