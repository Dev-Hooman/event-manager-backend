import mongoose from "mongoose";
import config from "../config/appconfig.js";
import { defaultAvatarPath } from "../config/constants.js";

const ROLES = config.auth.active_roles;

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: `${defaultAvatarPath}`
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ROLES,
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
      default: "UTC",
    },
  },
  { timestamps: true }
);

const User = model("users", UserSchema);

export default User;
