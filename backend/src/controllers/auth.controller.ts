import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "plase fill all the fields correctly" });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const CreatedUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: CreatedUser._id },
      process.env.JWT_SECERT_KEY!,
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: CreatedUser._id,
        name: CreatedUser.name,
        email: CreatedUser.email,
      },
    });
  } catch (error) {
    console.log("authenticaion failed !!! ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if ((!name && !email) || !password) {
      return res
        .status(400)
        .json({ message: "plase fill all the fields correctly" });
    }

    const user = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECERT_KEY!);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("login failed !!!", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log("logout error !!!", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default { registerUser, loginUser, logoutUser, getUser };
