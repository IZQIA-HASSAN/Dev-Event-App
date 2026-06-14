import {next} from 'next' ;
import mongoose, { Document, Model, Schema } from "mongoose";


// ── Types ──────────────────────────────────────────────────────────────────────

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Converts a title into a URL-friendly slug e.g. "My Event!" → "my-event" */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")  // remove special characters
    .replace(/\s+/g, "-")           // replace spaces with hyphens
    .replace(/-+/g, "-");           // collapse consecutive hyphens
}

/** Normalises a date string to ISO 8601 (YYYY-MM-DD). Throws if invalid. */
function normaliseDate(raw: string): string {
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) throw new Error(`Invalid date: "${raw}"`);
  return parsed.toISOString().split("T")[0]; // → "2025-06-14"
}

/** Normalises time to 24-hour HH:MM format. Accepts "9:5", "09:05", "9:05 AM" etc. */
function normaliseTime(raw: string): string {
  const trimmed = raw.trim();

  // Handle 12-hour format with AM/PM
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hours = parseInt(ampm[1], 10);
    const minutes = ampm[2];
    const period = ampm[3].toUpperCase();
    if (period === "AM" && hours === 12) hours = 0;
    if (period === "PM" && hours !== 12) hours += 12;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // Handle 24-hour format
  const h24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    return `${String(parseInt(h24[1], 10)).padStart(2, "0")}:${h24[2]}`;
  }

  throw new Error(`Invalid time format: "${raw}"`);
}

// ── Schema ─────────────────────────────────────────────────────────────────────

const EventSchema = new Schema<IEvent>(
  {
    title:       { type: String, required: [true, "Title is required"],       trim: true },
    // slug is auto-generated in the pre-save hook; unique index defined below
    slug:        { type: String, unique: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    overview:    { type: String, required: [true, "Overview is required"],    trim: true },
    image:       { type: String, required: [true, "Image is required"],       trim: true },
    venue:       { type: String, required: [true, "Venue is required"],       trim: true },
    location:    { type: String, required: [true, "Location is required"],    trim: true },
    date:        { type: String, required: [true, "Date is required"] },
    time:        { type: String, required: [true, "Time is required"] },
    mode: {
      type:     String,
      required: [true, "Mode is required"],
      enum:     {
        values:  ["online", "offline", "hybrid"],
        message: 'Mode must be "online", "offline", or "hybrid"',
      },
    },
    audience:  { type: String,   required: [true, "Audience is required"],  trim: true },
    agenda:    { type: [String], required: [true, "Agenda is required"],    default: [] },
    organizer: { type: String,   required: [true, "Organizer is required"], trim: true },
    tags:      { type: [String], required: [true, "Tags are required"],     default: [] },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// Explicit unique index on slug (supplements the schema-level unique: true)
EventSchema.index({ slug: 1 }, { unique: true });

// ── Pre-save Hook ──────────────────────────────────────────────────────────────

EventSchema.pre("save", function (next) {
  // Regenerate slug only when title is new or modified
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }

  // Normalise date → ISO format (YYYY-MM-DD) and time → HH:MM (24h)
  if (this.isModified("date")) {
    this.date = normaliseDate(this.date);
  }
  if (this.isModified("time")) {
    this.time = normaliseTime(this.time);
  }

  // Guard: agenda and tags must be non-empty arrays
  if (!this.agenda.length)  return next(new Error("Agenda must have at least one item"));
  if (!this.tags.length)    return next(new Error("Tags must have at least one item"));

  next();
});

// ── Model ──────────────────────────────────────────────────────────────────────

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;