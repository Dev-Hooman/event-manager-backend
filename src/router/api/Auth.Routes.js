import express from "express";
import {
  changePassword,
  forgetPassword,
  loginUser,
  registerUser,
  setPassword,
  updateProfile,
  verifyOtp,
} from "../../controllers/Auth.Controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";
import config from "../../config/appconfig.js";

const AuthRouter = express.Router();

AuthRouter.post("/register-user", registerUser);
AuthRouter.post("/login", loginUser);

//-------------- reset password routes --------------
AuthRouter.post("/forget-password", forgetPassword);
AuthRouter.post("/verify-otp", verifyOtp);
AuthRouter.post("/set-password", setPassword);
//---------------------------------------------------

AuthRouter.post("/change-password", authenticate, CheckRole(config.auth.active_roles), changePassword); //all roles support
AuthRouter.patch("/update-profile", authenticate, CheckRole(config.auth.active_roles), updateProfile);

export default AuthRouter;
