import express from "express";
import { Sensor } from "../models/farm.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Sensors
 *  description: sensor management
 */

// Create sensor
/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Create a new sensor
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Temperature Sensor"
 *               type: "Temperature"
 *               measurement_unit: "Celsius"
 *               Iot: "64a7f0c2e4b0c8b1a5d6e7f8"
 *     responses:
 *       201:
 *         description: Sensor created
 */

// Create a new sensor
router.post("/", async (req, res) => {
  Sensor.create(req.body)
    .then((sensor) => res.status(201).json(sensor))
    .catch((err) => res.status(400).json(err));
});

/** @swagger
 * /sensors:
 *   get:
 *     summary: Get all sensors
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: List of sensors
 */
// Get all sensors
router.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.find().populate("readings");
    res.status(200).json(sensors);
  } catch (error) {
    res.sendStatus(404);
  }
});

/** @swagger
 * /sensors/{id}:
 *   get:
 *     summary: Get a sensor by ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sensor ID
 *     responses:
 *       200:
 *         description: The sensor data
 *       404:
 *         description: Sensor not found
 */
// Get a sensor by ID
router.get("/:id", async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params["id"]).populate("readings");
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.sendStatus(404);
  }
});

/** @swagger
 * /sensors/{id}:
 *   patch:
 *     summary: Update a sensor by ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Updated Sensor Name"
 *               type: "Updated Type"
 *               measurement_unit: "Updated Unit"
 *               Iot: "64a7f0c2e4b0c8b1a5d6e7f8"
 *     responses:
 *       200:
 *         description: Sensor updated
 *       404:
 *         description: Sensor not found
 *
 *
 */
// Update a sensor by ID
router.patch("/:id", async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params["id"], req.body);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(404).json(error);
  }
});

/** @swagger
 * /sensors/{id}:
 *   delete:
 *     summary: Delete a sensor by ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sensor ID
 *     responses:
 *       200:
 *         description: Sensor deleted
 *       404:
 *         description: Sensor not found
 */
// Delete a sensor by ID
router.delete("/:id", async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params["id"]);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(404).json(error);
  }
});

export default router;
