import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import "./src/config/passport.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

// ✅ Local vs Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally at ${PORT}`);
  });
} else {
  // Vercel expects an export
  export default app;
}
