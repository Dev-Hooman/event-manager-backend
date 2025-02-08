import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { CheckRole } from "../../middleware/checkRoleMiddleware.js";
import { createBooking, getUserBookings, cancelBooking, updateBookingStatus } from "../../controllers/Booking.Controller.js";

const BookingRouter = express.Router();

BookingRouter.post("/create-booking", authenticate, createBooking);
BookingRouter.get("/my-bookings", authenticate, getUserBookings);
BookingRouter.delete("/cancel-booking/:id", authenticate, CheckRole(["vendor", "superadmin"]), cancelBooking);
BookingRouter.patch("/update-booking-status/:bookingId", authenticate, CheckRole(["vendor", "superadmin"]), updateBookingStatus);

export default BookingRouter;
