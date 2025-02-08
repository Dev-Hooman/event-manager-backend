import express from "express";
import { getAllUsers, getSingleUser, removeUser, updateProfile, updateUser } from "../../controllers/User.Controller.js";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import config from "../../config/appconfig.js";
import multer from "multer";

const UserRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

UserRouter.get("/all-users", getAllUsers);
UserRouter.delete("/remove-user/:id", authenticate ,CheckRole(["superadmin"]), removeUser);
UserRouter.get("/single-user/:id", getSingleUser);
UserRouter.patch("/update-user", authenticate, CheckRole(["superadmin"]), upload.single("image") ,updateUser);
UserRouter.patch("/update-profile", authenticate, CheckRole(config.auth.active_roles), upload.single("image") ,updateProfile);


export default UserRouter;
