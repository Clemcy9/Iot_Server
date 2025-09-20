import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/user.js";
import authMiddleware, { createToken } from "../middleware/authMiddleware.js";
import { use } from "react";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

// create auth routes
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: "clement@gmail.com"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 * */

// register user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({ msg: "user created" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               email: "clement@gmail.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully, token: <token>
 *       401:
 *         description: Invalid credentials
 */
// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "invalid credentials" });
    const compare_pswd = await bycrypt.compare(password, user.password);
    if (!compare_pswd) {
      return res.status(401).json({ msg: "invalid credentials" });
    }

    // generate token
    const token = createToken(user);
    res.status(200).json({ msg: "login successfully", token: token });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;
