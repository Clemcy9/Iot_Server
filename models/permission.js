import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default Permission = mongoose.model("Permission", permissionsSchema);
