import { z } from "zod";

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name cannot exceed 50 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional(),
  })
  .refine((data) => data.fullName !== undefined || data.phone !== undefined, {
    message: "At least one field must be provided",
  });

export const userProfileParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export const requestEmailChangeOtpSchema = z.object({
  newEmail: z
    .string()
    .trim()
    .email("Invalid email address"),
});

export const verifyEmailOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const updateAccountStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "isActive is required",
    invalid_type_error: "isActive must be a boolean",
  }),
});

export const updateVendorProfileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters").optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .optional(),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .optional(),

  profileImage: z
    .object({
      publicId: z.string(),
      url: z.string().url("Invalid image URL"),
    })
    .optional(),

  address: z
    .object({
      addressLine1: z.string().min(5, "Address is required"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      pincode: z.string().regex(/^[0-9]{4,10}$/, "Invalid pincode"),
    })
    .optional(),

  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
});
