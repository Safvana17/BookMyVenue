# Validators Documentation

This directory contains Zod-based validation schemas for the BookMyVenue frontend application. These schemas provide client-side validation that matches the backend validation rules.

## Overview

- **auth.validators.js** - Authentication related validations (login, register, OTP, password reset)
- **venue.validators.js** - Venue creation and editing validations
- **profile.validators.js** - User and vendor profile update validations
- **booking.validators.js** - Booking related validations
- **validation.utils.js** - Utility helper functions for validation
- **index.js** - Barrel export file

## Installation

Make sure Zod is installed in your package.json:

```bash
npm install zod
```

## Usage Examples

### Basic Validation

```javascript
import { loginSchema, validateSchemaSafe } from "@/lib/validators";

const formData = { email: "user@example.com", password: "password123" };
const result = validateSchemaSafe(loginSchema, formData);

if (result.success) {
  console.log("Valid:", result.data);
} else {
  console.log("Errors:", result.errors);
}
```

### In React Forms

```javascript
import { useState } from "react";
import { registerSchema, validateSchemaSafe, getFieldError } from "@/lib/validators";

function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateSchemaSafe(registerSchema, formData);

    if (result.success) {
      // Submit form
      console.log("Form is valid:", result.data);
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
      {errors.fullName && <span>{errors.fullName}</span>}

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}

      <button type="submit">Register</button>
    </form>
  );
}
```

### Custom Validation Combinations

```javascript
import { z } from "zod";
import { updateVendorProfileSchema } from "@/lib/validators";

// Extend existing schema
const updateVendorWithImageSchema = updateVendorProfileSchema.extend({
  profileImage: z
    .object({
      file: z.instanceof(File),
      preview: z.string(),
    })
    .optional(),
});
```

## Available Schemas

### Authentication Schemas

- `loginSchema` - Email and password validation
- `registerSchema` - Full registration form with password confirmation
- `verifyOtpSchema` - OTP verification with email
- `forgotPasswordSchema` - Forgot password email validation
- `resetPasswordSchema` - Password reset with confirmation

### Venue Schemas

- `createVenueSchema` - Complete venue creation form validation
- `editVenueSchema` - Venue edit form validation (same as create)
- `venueQuerySchema` - Venue listing and filtering query validation

### Profile Schemas

- `updateProfileSchema` - User profile update validation
- `userProfileParamsSchema` - User ID parameter validation
- `requestEmailChangeOtpSchema` - Email change request validation
- `verifyEmailOtpSchema` - Email change OTP verification
- `updateAccountStatusSchema` - Account status update
- `updateVendorProfileSchema` - Vendor profile update validation

### Booking Schemas

- `bookingParamsSchema` - Booking ID parameter validation
- `bookingQuerySchema` - Booking list query validation
- `createBookingSchema` - Booking creation validation
- `updateBookingStatusSchema` - Booking status update validation
- `cancelBookingSchema` - Booking cancellation validation

## Utility Functions

### `validateSchema(schema, data)`

Validates data against a schema. Throws on invalid data.

```javascript
const validated = validateSchema(loginSchema, formData);
```

### `validateSchemaSafe(schema, data)` ⭐ Recommended

Safely validates data without throwing errors.

```javascript
const result = validateSchemaSafe(loginSchema, formData);
if (result.success) {
  // Use result.data
} else {
  // Use result.errors
}
```

### `getFieldError(errors, fieldName)`

Get error message for a specific field.

```javascript
const emailError = getFieldError(errors, "email");
```

### `hasFieldError(errors, fieldName)`

Check if a field has an error.

```javascript
if (hasFieldError(errors, "email")) {
  // Show error UI
}
```

### `clearFieldError(errors, fieldName)`

Remove error for a specific field.

```javascript
setErrors(clearFieldError(errors, "email"));
```

### `clearAllErrors()`

Clear all validation errors.

```javascript
setErrors(clearAllErrors());
```

## Validation Rules

### Auth Validations

- **Email**: Valid email format required
- **Password**: Minimum 6 characters
- **Full Name**: 3-50 characters
- **OTP**: Exactly 6 digits
- **Confirm Password**: Must match password field

### Venue Validations

- **Name**: 3-100 characters
- **Description**: 10-2000 characters
- **Category**: Must be from predefined list
- **Phone**: 10-15 digits
- **Pincode**: 4-10 digits
- **URLs**: Valid format when provided
- **Capacities/Prices**: Non-negative numbers
- **Amenities**: Must be from predefined list

### Profile Validations

- **Full Name**: 3-50 characters
- **Phone**: Valid format (10 digits for users, 10 digits starting with 6-9 for vendors)
- **Company Name**: Minimum 2 characters
- **Bio**: 10-300 characters
- **Email**: Valid email format

### Booking Validations

- **Guest Count**: At least 1
- **Start Date**: Must be in future
- **End Date**: Must be after start date
- **Special Requests**: Maximum 500 characters
- **Cancellation Reason**: 5-500 characters

## Integration with Backend

These validation schemas are designed to mirror the backend Zod schemas. When updating backend validators, ensure frontend validators are updated accordingly to maintain consistency:

### Backend Location
- `server/src/presentation/validators/`

### Frontend Location
- `client/src/lib/validators/`

## Best Practices

1. **Always use `validateSchemaSafe`** - Prevents unhandled exceptions
2. **Validate on blur** - Provide real-time feedback to users
3. **Show field-specific errors** - Use `getFieldError()` for better UX
4. **Clear errors appropriately** - Use `clearFieldError()` when user starts editing
5. **Match backend validation** - Keep frontend and backend rules synchronized
6. **Extend schemas carefully** - Use `.extend()` or `.omit()` to reuse schemas

## Adding New Validators

1. Create a new validator file in the `validators` directory
2. Define Zod schemas following the existing patterns
3. Export the schemas
4. Update `index.js` to export from the new file
5. Add documentation here

## Testing

When testing forms with these validators:

```javascript
import { loginSchema, validateSchemaSafe } from "@/lib/validators";

describe("Validation", () => {
  it("should validate correct login data", () => {
    const result = validateSchemaSafe(loginSchema, {
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = validateSchemaSafe(loginSchema, {
      email: "invalid-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.errors.email).toBeDefined();
  });
});
```
