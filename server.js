import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/user.js";
import connectDB from "./config/db.js";

connectDB();

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

app.post("/users", (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).json({ message: user }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.listen(process.env.PORT, () =>
  console.log("server running on port", process.env.PORT)
);
