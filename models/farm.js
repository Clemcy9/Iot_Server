import mongoose from "mongoose";

const farmSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model("Farm", farmSchema);

const iotSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    status: [{ type: String, default: "active" }],
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm" },
  },
  {
    timestamps: true,
  }
);

const Iot = mongoose.model("Iot", iotSchema);

const sensorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    measurement_unit: String,
    Iot: { type: mongoose.Schema.Types.ObjectId, ref: "Iot" },
  },
  {
    timestamps: true,
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

const readingSchema = mongoose.Schema(
  {
    value: String,
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
  },
  {
    timestamps: true,
  }
);

const Reading = mongoose.model("Reading", readingSchema);

export { Farm, Iot, Sensor, Reading };
