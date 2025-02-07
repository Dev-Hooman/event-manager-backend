import express from "express";
import { getAllUsers, removeUser, updateUser } from "../../controllers/User.Controller.js";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.get("/all-users", getAllUsers);
UserRouter.delete("/remove-user/:id", authenticate ,CheckRole(["superadmin"]) ,removeUser);
UserRouter.patch("/update-user", authenticate, CheckRole(["superadmin"]), updateUser);


export default UserRouter;
