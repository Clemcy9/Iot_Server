import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import { Farm, Iot, Sensor, Reading } from "./models/farm.js";
import farmRoutes from "./routes/farmRoutes.js";
import iotRoutes from "./routes/iotRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";

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
app.use("/farms", farmRoutes);

// Iot routes
app.use("/iot", iotRoutes);

// sensors routes
app.use("/sensors", sensorRoutes);

// Readings routes for admin (only admin see's all readings)
app.use("/readings", readingRoutes);

app.listen(process.env.PORT, () =>
  console.log("server running on port", process.env.PORT)
);
