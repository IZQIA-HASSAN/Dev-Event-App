import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IEvent } from "./event.model";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** RFC 5322-inspired regex for email validation */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Schema ─────────────────────────────────────────────────────────────────────

const BookingSchema = new Schema<IBooking>(
  {
    // Reference to the Event collection; indexed for faster lookups
    eventId: {
      type:     Schema.Types.ObjectId,
      ref:      "Event",
      required: [true, "Event ID is required"],
      index:    true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      lowercase: true, // normalise before saving
      trim:      true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message:   "Invalid email address format",
      },
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// ── Pre-save Hook ──────────────────────────────────────────────────────────────

BookingSchema.pre("save", async function (next) {
  // Verify the referenced event exists before allowing a booking to be saved
  if (this.isModified("eventId")) {
    const Event = mongoose.model<IEvent>("Event");
    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      return next(new Error(`Event with ID "${this.eventId}" does not exist`));
    }
  }

  next();
});

// ── Model ──────────────────────────────────────────────────────────────────────

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;