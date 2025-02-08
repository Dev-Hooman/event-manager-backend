import Booking from "../models/Booking.js";
import bookingValidation from "../validations/bookingValidation.js";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
    if (req.user.role === "superadmin" || req.user.role === "vendor") {
      return res.status(403).json({
        error: `${req.user.role} cannot book, only users are eligible to book`,
        success: false,
      });
    }
    const { error } = bookingValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: error.details[0].message, success: false });

    const event = await Event.findById(req.body.eventId);
    if (!event)
      return res.status(404).json({ error: "Event not found", success: false });

    if (event.availableSeats < req.body.seats)
      return res
        .status(400)
        .json({ error: "Not enough available seats", success: false });

    const existingBooking = await Booking.findOne({
      eventId: req.body.eventId,
      userId: req.user._id,
    });
    if (existingBooking)
      return res
        .status(400)
        .json({ error: "You have already booked this event", success: false });

    event.availableSeats -= req.body.seats;
    await event.save();

    const booking = await Booking.create({
      ...req.body,
      eventTitle: event.title,
      userId: req.user._id,
    });
    res.status(201).json({ booking, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req.user._id; // ==========> this will be used specifically for vendor
  try {
    if (req.user.role === "user") {
      const bookings = await Booking.find({ userId: req.user._id })
        .populate({
          path: "eventId",
          select:
            "title description date time location category image price availableSeats userId",
          populate: { path: "userId", model: "users", select: "name email" },
        })
        .populate({ path: "userId", model: "users", select: "name email" });

      res.json({ bookings, success: true });
    } else if (req.user.role === "vendor") {
      const bookings = await Booking.find()
        .populate({
          path: "eventId",
          match: { userId: userId },
          select:
            "title description date time location category image price availableSeats userId",
          populate: { path: "userId", model: "users", select: "name email" },
        })
        .populate({ path: "userId", model: "users", select: "name email" });

      const vendorBookings = bookings.filter(
        (booking) => booking.eventId !== null
      );

      res.json({ bookings: vendorBookings, success: true });
    } else if (req.user.role === "superadmin") {
      const bookings = await Booking.find()
        .populate({
          path: "eventId",
          select:
            "title description date time location category image price availableSeats userId",
          populate: { path: "userId", model: "users", select: "name email" },
        })
        .populate({ path: "userId", model: "users", select: "name email" });

      res.json({ bookings, success: true });
    } else {
      res.status(403).json({ error: "Unauthorized access", success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res
        .status(404)
        .json({ error: "Booking not found", success: false });

    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableSeats += booking.seats;
      await event.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking canceled successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ["confirmed", "pending", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status value",
        success: false,
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
        success: false,
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};
