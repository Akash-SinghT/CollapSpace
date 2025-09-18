import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST, loads .env before anything else

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import "./src/config/passport.js"; // ✅ Import AFTER dotenv
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session middleware (needed if using passport sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Enable CORS before routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// DB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/get", (req, res) => {
  res.send("hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
