import express from "express";
import { Farm } from "../models/farm";

const router = express.Router();

// Create a new farm
router.post("/", async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json(farm);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all farms
router.get("/", async (req, res) => {
  try {
    const farms = await Farm.find();
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific farm by ID
router.get("/:id", async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate();
    res.status(200).json(farm);
  } catch (err) {
    res.status(404).json({ errror: err.message });
  }
});

// update farm
router.patch("/:id", async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id).populate();
    res.status(200).json(farm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// delete farm
router.delete("/:id", async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.status(200).json(farm);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
