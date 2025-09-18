import User from "../models/User.js";
import Token from "../models/Token.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { validateRegister, validateLogin } from "../utils/validator.js";
import { generateTokens, saveRefreshToken } from "../services/generateToken.js";

const PREDEFINED_ADMINS = ["admin@example.com"]; // predefined admin emails

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const error = validateRegister({ username, email, password });
    if (error.length) return res.status(400).json({ error });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const assignedRole = PREDEFINED_ADMINS.includes(email) ? "admin" : null;

    const user = await User.create({
      username,
      email,
      password,
      role: assignedRole,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    await saveRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const error = validateLogin({ email, password });
    if (error.length)
      return res.status(400).json({ message: error, success: false });

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    await saveRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await Token.findOneAndDelete({ token });

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const existingToken = await Token.findOne({ token });
    if (!existingToken)
      return res.status(403).json({ message: "Invalid token" });

    const { id } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Could not refresh token" });
  }
};

// GOOGLE CALLBACK
export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user)
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`
      );

    const { accessToken, refreshToken } = generateTokens(user._id);
    await saveRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${
        process.env.FRONTEND_URL
      }/auth/success?accessToken=${encodeURIComponent(accessToken)}&id=${
        user._id
      }&username=${encodeURIComponent(user.username)}&role=${user.role || ""}`
    );
  })(req, res, next);
};

// GITHUB CALLBACK
export const githubCallback = (req, res, next) => {
  passport.authenticate("github", { session: false }, async (err, user) => {
    if (err || !user)
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`
      );

    const { accessToken, refreshToken } = generateTokens(user._id);
    await saveRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${
        process.env.FRONTEND_URL
      }/auth/success?accessToken=${encodeURIComponent(accessToken)}&id=${
        user._id
      }&username=${encodeURIComponent(user.username)}&role=${user.role || ""}`
    );
  })(req, res, next);
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role)
      return res.status(400).json({ message: "Role already assigned" });

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
