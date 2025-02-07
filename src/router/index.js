import { Router } from "express";
import config from "../config/appconfig.js";
import AuthRouter from "./api/Auth.Routes.js";
import UserRouter from "./api/User.Routes.js";
import EventRouter from "./api/Event.Routes.js";
import BookingRouter from "./api/Booking.Routes.js";

const router = Router();
const basePath = config.api.base_path;

router.use(`${basePath}/auth`, AuthRouter);
router.use(`${basePath}/user`, UserRouter);
router.use(`${basePath}/event`, EventRouter);
router.use(`${basePath}/booking`, BookingRouter);


export default router;
