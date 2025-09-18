import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  googleCallback,
  githubCallback,
  updateRole,
  refreshAccessToken,
} from "../controller/authController.js";
import { authenticateJWT } from "../middleware/jwtAuth.js";

const router = express.Router();

//Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshAccessToken);

//Social Auth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", googleCallback);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/callback", githubCallback);
router.put("/update-role", authenticateJWT, updateRole);

export default router;
