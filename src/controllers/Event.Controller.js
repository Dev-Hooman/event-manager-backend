import { deleteFileFromS3, uploadFileToS3 } from "../utils/s3Config.js";
import Event from "../models/Event.js";
import eventValidation from "../validations/eventValidation.js";

export const createEvent = async (req, res) => {
  try {

    const { error } = eventValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: error.details[0].message, success: false });

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadFileToS3("events", req.file);
    }

    const event = await Event.create({ ...req.body, image: imageUrl });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message, success: true });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ error: "Event not found", success: false });
    res.json(event);
  } catch (error) {
    res.status(404).json({ error: "Event not found" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ error: "Event not found", success: false });

    let imageUrl = event.image;
    if (req.file) {
      if (event.image) await deleteFileFromS3(event.image);
      imageUrl = await uploadFileToS3("events", req.file);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { ...req.body, image: imageUrl },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ error: "Event not found", success: false });

    if (event.image) await deleteFileFromS3(event.image);
    await Event.findByIdAndDelete(eventId);

    res
      .status(200)
      .json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};
