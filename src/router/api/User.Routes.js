import express from "express";
import { getAllUsers, removeUser, updateUser } from "../../controllers/User.Controller.js";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import config from "../../config/appconfig.js";
import multer from "multer";

const UserRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

UserRouter.get("/all-users", getAllUsers);
UserRouter.delete("/remove-user/:id", authenticate ,CheckRole(["superadmin"]) ,removeUser);


UserRouter.patch("/update-user", authenticate, CheckRole(config.auth.active_roles), upload.single("image") ,updateUser);


export default UserRouter;
