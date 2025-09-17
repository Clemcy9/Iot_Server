import express from "express";
import { Farm } from "../models/farm.js";
import { populate } from "dotenv";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Farms
 *   description: Farm management
 */

// Create farm
/**
 * @swagger
 * /farms:
 *   post:
 *     summary: Create a new farm
 *     tags: [Farms]
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
router.post("/", async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /farms:
 *   get:
 *     summary: Get all farms
 *     tags: [Farms]
 *     responses:
 *       200:
 *         description: List of farms
 */
// Get all farms
router.get("/", async (req, res) => {
  try {
    const farms = await Farm.find().populate("iot");
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /farms/{id}:
 *   get:
 *     summary: Get a farm by ID
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The farm ID
 *     responses:
 *       200:
 *         description: Farm data
 *       404:
 *         description: Farm not found
 */
// Get a specific farm by ID
router.get("/:id", async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate({
      path: "iot",
      populate: { path: "sensor" },
    });
    if (!farm) {
      return res.status(404).json({ message: "Farm not found" });
    }
    res.status(200).json(farm);
  } catch (err) {
    res.status(404).json({ errror: err.message });
  }
});

/**
 * @swagger
 * /farms/{id}:
 *   patch:
 *     summary: Update a farm by ID
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The farm ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Updated Farm Name"
 *               location: "New Location"
 *     responses:
 *       200:
 *         description: Farm updated
 *       404:
 *         description: Farm not found
 */
// update farm
router.patch("/:id", async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id);
    res.status(200).json(farm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /farms/{id}:
 *   delete:
 *     summary: Delete a farm by ID
 *     tags: [Farms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The farm ID
 *     responses:
 *       200:
 *         description: Farm deleted
 *       404:
 *         description: Farm not found
 */
// delete farm
router.delete("/:id", async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.status(200).json(farm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
