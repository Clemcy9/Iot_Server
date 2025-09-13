import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Group from "./group.js";
const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    first_name: { type: String },
    last_name: String,
    is_active: Boolean,
    is_staff: Boolean,
    is_superuser: Boolean,
    last_login: Date,

    // relationships
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    user_permissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt;
});
