import { Router } from "express";
import config from "../config/appconfig.js";
import AuthRouter from "./api/Auth.Routes.js";
import UserRouter from "./api/User.Routes.js";

const router = Router();
const basePath = config.api.base_path;

router.use(`${basePath}/auth`, AuthRouter);
router.use(`${basePath}/user`, UserRouter);


export default router;
