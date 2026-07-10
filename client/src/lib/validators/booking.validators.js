import { z } from "zod";

const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

export const bookingParamsSchema = z.object({
  bookingId: z
    .string()
    .min(1, "Booking ID is required"),
});

export const bookingQuerySchema = z.object({
  page: z.coerce
    .number()
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),

  status: z
    .enum(Object.values(BookingStatus))
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),
});

export const createBookingSchema = z.object({
  venueId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid venue ID"),

  startDate: z
    .string()
    .or(z.date())
    .refine((date) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d > new Date();
    }, "Start date must be in the future"),

  endDate: z
    .string()
    .or(z.date()),

  guestCount: z.coerce
    .number()
    .min(1, "At least 1 guest is required"),

  specialRequests: z
    .string()
    .max(500, "Special requests cannot exceed 500 characters")
    .optional(),

  totalPrice: z.coerce
    .number()
    .min(0, "Total price cannot be negative"),
}).refine((data) => {
  const start = typeof data.startDate === "string" ? new Date(data.startDate) : data.startDate;
  const end = typeof data.endDate === "string" ? new Date(data.endDate) : data.endDate;
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const updateBookingStatusSchema = z.object({
  status: z
    .enum(Object.values(BookingStatus))
    .refine(
      (status) => status !== BookingStatus.PENDING,
      "Cannot update to pending status"
    ),
});

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(5, "Cancellation reason must be at least 5 characters")
    .max(500, "Cancellation reason cannot exceed 500 characters"),
});
