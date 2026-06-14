// Single entry point for all database models
export { default as Event } from "./Event.model";
export { default as Booking } from "./Booking.model";

// Type exports for use across the application
export type { IEvent } from "./Event.model";
export type { IBooking } from "./Booking.model";