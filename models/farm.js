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

farmSchema.virtual("iot", {
  ref: "Iot",
  localField: "_id",
  foreignField: "farm",
});

farmSchema.set("toObject", { virtuals: true });
farmSchema.set("toJSON", { virtuals: true });

// sensorSchema.set("toObject", { virtuals: true });
// sensorSchema.set("toJSON", { virtuals: true });

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

iotSchema.virtual("sensor", {
  ref: "Sensor",
  localField: "_id",
  foreignField: "iot",
});

iotSchema.set("toObject", { virtuals: true });
iotSchema.set("toJSON", { virtuals: true });

const Iot = mongoose.model("Iot", iotSchema);

const sensorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    measurement_unit: String,
    iot: { type: mongoose.Schema.Types.ObjectId, ref: "Iot" },
  },
  {
    timestamps: true,
  }
);

sensorSchema.virtual("readings", {
  ref: "Reading",
  localField: "_id",
  foreignField: "sensor",
});

sensorSchema.set("toObject", { virtuals: true });
sensorSchema.set("toJSON", { virtuals: true });

const Sensor = mongoose.model("Sensor", sensorSchema);

const readingSchema = mongoose.Schema(
  {
    readings: [{ value: String, timestamp: Date }],
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
  },
  {
    timestamps: true,
  }
);

const Reading = mongoose.model("Reading", readingSchema);

export { Farm, Iot, Sensor, Reading };
