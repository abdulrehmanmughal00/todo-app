import express, { type application } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import cors from "cors";
const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

export default app;
