import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import { Farm, Iot, Sensor, Reading } from "./models/farm.js";

connectDB();

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

app.post("/users", (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).json({ message: user }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// farms routes
app.post("/farms", async (req, res) => {
  Farm.create(req.body)
    .then((farm) => res.status(201).json(farm))
    .catch((err) => res.status(400).json(err));
});

app.get("/farms", async (req, res) => {
  const farms = await Farm.find();
  res.status(200).json(farms);
});

app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params["id"]).populate();
  res.status(200).json(farm);
});

app.patch("/farms/:id", async (req, res) => {
  const farm = await Farm.findByIdAndUpdate(
    req.params["id"],
    req.body
  ).populate();
  res.status(200).json(farm);
});

app.delete("/farms/:id", async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params["id"]);
  res.status(200).json(farm);
});

// Units routes
app.post("/iots", async (req, res) => {
  Iot.create(req.body)
    .then((iot) => res.status(201).json(iot))
    .catch((err) => res.status(400).json(err));
});

app.get("/iots", async (req, res) => {
  const iot = await Iot.find();
  res.status(200).json(iot);
});

app.get("/iots/:id", async (req, res) => {
  const iot = await Iot.findById(req.params["id"]).populate();
  res.status(200).json(iot);
});

app.patch("/iots/:id", async (req, res) => {
  const iot = await Iot.findByIdAndUpdate(req.params["id"], req.body);
  res.status(200).json(iot);
});

app.delete("/iots/:id", async (req, res) => {
  const iot = await Iot.findByIdAndDelete(req.params["id"]);
  res.status(200).json(iot);
});

// Sensors routes
app.post("/sensors", async (req, res) => {
  Sensor.create(req.body)
    .then((sensor) => res.status(201).json(sensor))
    .catch((err) => res.status(400).json(err));
});

app.get("/sensors", async (req, res) => {
  const sensor = await Sensor.find();
  res.status(200).json(sensor);
});

app.get("/sensors/:id", async (req, res) => {
  const sensor = await Sensor.findById(req.params["id"]).populate();
  res.status(200).json(sensor);
});

app.patch("/sensors/:id", async (req, res) => {
  const sensor = await Sensor.findByIdAndUpdate(req.params["id"], req.body);
  res.status(200).json(sensor);
});

app.delete("/sensors/:id", async (req, res) => {
  const sensor = await Sensor.findByIdAndDelete(req.params["id"]);
  res.status(200).json(sensor);
});

// Readings routes for admin (only admin see's all readings)

app.post("/readings", async (req, res) => {
  const readings = await Reading.insertMany(req.body);
  res.status(201).json(readings);
});

// get all sensors readings for a particular iot node
app.get("/iot/:iotId/readings", async (req, res) => {
  // const readings = await Reading.find()
  const iot_readings = Iot.findById(req.params["iotId"], {
    name,
    sensor,
  }).populate();

  res.status(200).json(iot_readings);
});

// get a sensor readings for a particular iot node
app.get("/iot/:sensorId", async (req, res) => {
  const sensor_readings = Sensor.findById(req.params["sensorId"]).populate();
  res.status(200).json(sensor_readings);
});

// auth required
app.get("/readings", async (req, res) => {
  const readings = await Reading.find();
  res.status(200).json(readings);
});

app.delete("/readings/:id", async (req, res) => {
  const reading = await Reading.findByIdAndDelete(req.params["id"]);
  res.status(200).json(reading);
});
app.listen(process.env.PORT, () =>
  console.log("server running on port", process.env.PORT)
);
