import express from "express";
import { Iot, Sensor, Reading } from "../models/farm.js";
const router = express.Router();

/** * @swagger
 * tags:
 *  name: Readings
 *  description: Reading management
 */

/**
 * @swagger
 * /readings:
 *   post:
 *     summary: Create new readings
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             example:
 *               - sensor: "64a7f0c2e4b0c8b1a5d6e7f8"
 *                 readings:
 *                   - value: "25.5"
 *                     timestamp: "2024-06-20T12:00:00Z"
 *                   - value: "26.0"
 *                     timestamp: "2024-06-20T13:00:00Z"
 *               - sensor: "64a7f0c2e4b0c8b1a5d6e7f9"
 *                 readings:
 *                   - value: "30.2"
 *                     timestamp: "2024-06-20T12:00:00Z"
 *                   - value: "29.8"
 *                     timestamp: "2024-06-20T13:00:00Z"
 *     responses:
 *       201:
 *         description: Readings created
 */
//create readings
router.post("/", async (req, res) => {
  try {
    const readings = await Reading.insertMany(req.body);
    res.status(201).json(readings);
  } catch (error) {
    res.status(400).json(error);
  }
});

/** @swagger
 * /readings/iot/{iotId}:
 *   get:
 *     summary: Get all readings for a particular Iot node
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: iotId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Iot node ID
 *     responses:
 *       200:
 *         description: List of readings for the specified Iot node
 */
// get all sensors readings for a particular iot node
router.get("/iot/:iotId", async (req, res) => {
  // const readings = await Reading.find()
  try {
    const iot_readings = Iot.findById(req.params["iotId"]).populate("sensor");

    res.status(200).json(iot_readings);
  } catch (error) {
    res.status(400).json(error);
  }
});

/**  @swagger
 * /readings/iot/{sensorId}:
 *   get:
 *     summary: Get readings for a particular sensor
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sensor ID
 *     responses:
 *       200:
 *         description: List of readings for the specified sensor
 */
// get a sensor (temp_sensor) readings for a particular iot node
router.get("/iot/:sensorId", async (req, res) => {
  const sensor_readings = Sensor.findById(req.params["sensorId"]).populate(
    "readings"
  );
  res.status(200).json(sensor_readings);
});

/** @swagger
 * /readings:
 *   get:
 *     summary: Get all readings (admin only)
 *     tags: [Readings]
 *     responses:
 *       200:
 *         description: List of all readings
 */
// auth required
// get all readings across all users and sensors
router.get("/", async (req, res) => {
  const readings = await Reading.find();
  res.status(200).json(readings);
});

/** @swagger
 * /readings/{id}:
 *   delete:
 *     summary: Delete a reading by ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reading ID
 *     responses:
 *       200:
 *         description: Reading deleted
 */
// delete a reading by ID
router.delete("/:id", async (req, res) => {
  const reading = await Reading.findByIdAndDelete(req.params["id"]);
  res.status(200).json(reading);
});

// user only related readings

// gat a sensor readings of a particular user

export default router;
