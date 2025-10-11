import express from "express";
import { Iot, Sensor, Actuator } from "../models/farm.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Iot
 *   description: Iot management
 */

// Register a new Iot
/**
 * @swagger
 * /iot/register:
 *   post:
 *     summary: Register new Iot
 *     description: endpoint to register your iot devices
 *     tags: [Iot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             example:
 *               name: "Iot Node 1"
 *               status: "active"
 *               sensors: [{"name":"sensor_name"}, {"name":"sensor2_name"}]
 *               actuator: [{"name":"actuator_name"}, {"name":"actuator2_name"}]
 *     responses:
 *       201:
 *         description: Iot created
 */
// Create Iot
router.post("/register", async (req, res) => {
  console.log("hello from iot/register");

  try {
    // 1️⃣ Create IoT
    const iot = await Iot.create({
      name: req.body.name || "default_name",
      status: req.body.status || "active",
      farm: req.body.farm || null,
    });

    console.log("iot is:", iot);

    // if using urlencode to send array, convert from string first
    // const parsed = JSON.parse(req.body.sensors);
    // const sensors = Array.isArray(parsed) ? parsed : [];

    // 2️⃣ Create sensors (if provided)
    const sensors = Array.isArray(req.body.sensors) ? req.body.sensors : [];

    let createdSensors = [];
    if (sensors.length > 0) {
      const updated_sensors = sensors.map((sensor) => ({
        ...sensor,
        iot: iot._id,
      }));

      createdSensors = await Sensor.insertMany(updated_sensors);
      console.log("sensors created:", createdSensors);
    }

    // 2️⃣ Create actuators (if provided)
    const actuators = Array.isArray(req.body.actuators)
      ? req.body.actuators
      : [];

    let createdActuators = [];
    if (actuators.length > 0) {
      const updated_actuators = actuators.map((actuator) => ({
        ...actuator,
        iot: iot._id,
      }));

      createdActuators = await Actuator.insertMany(updated_actuators);
      console.log("actuators created:", createdActuators);
    }

    // 3️⃣ Single response
    res.status(201).json({
      message: "IoT and sensors created successfully",
      iot,
      sensors: createdSensors,
      actuators: createdActuators,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: `IoT registration failed: ${error.message}` });
  }
});

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
