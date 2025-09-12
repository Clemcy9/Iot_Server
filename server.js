import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" }).status(200);
});

app.listen(process.env.PORT, () =>
  console.log("server running on port", process.env.PORT)
);
