import express from "express";
import User from "../models/user.js";
import { Farm } from "../models/farm.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// get all users, auth required
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

// Create farm
/**
 * @swagger
 * /user/farms:
 *   post:
 *     summary: Create a new farm (tied to authenticated user)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Hydroponics Farm"
 *               location: "Uyo"
 *     responses:
 *       201:
 *         description: Farm created
 */

// Create a new farm
router.post("/farms", authMiddleware, async (req, res) => {
  try {
    const farm = await Farm.create(req.body, { owner: req.user._id });
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all farms
/**
 * @swagger
 * /user/farms:
 *   get:
 *     summary: Get all farms (tied to authenticated user)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of farms
 */
router.get("/farms", authMiddleware, async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user._id }).populate("iot");
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
