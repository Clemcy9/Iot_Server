import express from "express";
import { Iot } from "../models/farm.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Iot
 *   description: Iot management
 */

// Create a new Iot
/**
 * @swagger
 * /iot:
 *   post:
 *     summary: Create a new Iot
 *     tags: [Iot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Iot Node 1"
 *               status: "active"
 *               farm: "64a7f0c2e4b0c8b1a5d6e7f8"
 *     responses:
 *       201:
 *         description: Iot created
 */
// Create Iot
router.post("/", async (req, res) => {
  Iot.create(req.body)
    .then((iot) => res.status(201).json(iot))
    .catch((err) => res.status(400).json(err));
});

/** @swagger
 * /iot:
 *   get:
 *     summary: Get all Iot
 *     tags: [Iot]
 *     responses:
 *       200:
 *         description: List of Iot
 */
// Get all Iot
router.get("/", async (req, res) => {
  try {
    const iot = await Iot.find().populate("sensor");
    res.status(200).json(iot);
  } catch (error) {
    res.status(404).json(error);
  }
});

/** @swagger
 * /iot/{id}:
 *   get:
 *     summary: Get a Iot by ID
 *     tags: [Iot]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Iot ID
 *     responses:
 *       200:
 *         description: Iot data
 *       400:
 *         description: Iot not found
 */
// Get a Iot by ID
router.get("/:id", async (req, res) => {
  try {
    const iot = await Iot.findById(req.params["id"]).populate({
      path: "sensors",
    });
    if (!iot) {
      return res.status(404).json({ message: "Iot not found" });
    }
    res.status(200).json(iot);
  } catch (error) {
    res.status(400).json(error);
  }
});

/** @swagger
 * /iot/{id}:
 *   patch:
 *     summary: Update a Iot by ID
 *     tags: [Iot]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Iot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Updated Iot Node"
 *               status: "inactive"
 *               farm: "64a7f0c2e4b0c8b1a5d6e7f8"
 *     responses:
 *       200:
 *         description: Iot updated
 *       404:
 *         description: Iot not found
 */
// Update a Iot by ID
router.patch("/:id", async (req, res) => {
  try {
    const iot = await Iot.findByIdAndUpdate(req.params["id"], req.body);
    res.status(200).json(iot);
  } catch (error) {
    res.sendStatus(404);
  }
});

/** @swagger
 * /iot/{id}:
 *   delete:
 *     summary: Delete a Iot by ID
 *     tags: [Iot]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Iot ID
 *     responses:
 *       200:
 *         description: Iot deleted
 *       404:
 *         description: Iot not found
 */
// Delete a Iot by ID
router.delete("/:id", async (req, res) => {
  try {
    const iot = await Iot.findByIdAndDelete(req.params["id"]);
    res.status(200).json(iot);
  } catch (error) {
    res.sendStatus(404);
  }
});

export default router;
