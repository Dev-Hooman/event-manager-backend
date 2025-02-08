import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { createEvent, deleteEvent, getEvents, getSingleEvent, getUsersEvents, updateEvent } from "../../controllers/Event.Controller.js";
import multer from "multer";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";

const EventRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

EventRouter.post("/create-event", authenticate, CheckRole(["superadmin", "vendor"]), upload.single("image"), createEvent);
EventRouter.get("/all-events", getEvents);
EventRouter.get("/single-event/:id", getSingleEvent);
EventRouter.get("/all-users-events", authenticate, getUsersEvents);
EventRouter.patch("/update-event/:id", authenticate, CheckRole(["superadmin", "vendor"]), upload.single("image"), updateEvent);
EventRouter.delete("/delete-event/:id", authenticate, CheckRole(["superadmin", "vendor"]), deleteEvent);



export default EventRouter;
