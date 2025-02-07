import Booking from "../models/Booking.js";
import bookingValidation from "../validations/bookingValidation.js";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
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

    event.availableSeats -= req.body.seats;
    await event.save();

    const booking = await Booking.create({ ...req.body, eventTitle: event.title });
    res.status(201).json({ booking, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("eventId");
    res.json({ bookings, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id}).populate("eventId");
    res.json({ bookings, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ error: "Booking not found", success: false });

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
  