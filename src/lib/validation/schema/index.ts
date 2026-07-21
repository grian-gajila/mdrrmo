import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── ADMIN AUTH ───────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username too long'),
  password: z.string().min(1, 'Password is required'),
});

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── VOLUNTEER APPLICATION ────────────────────────────────────────────────────

export const applicationStep1Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  middleName: z.string().min(2, 'Middle name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  gender: z.enum(['Male', 'Female', 'Prefer not to say']),
  age: z
    .number()
    .int()
    .min(18, 'You must be at least 18 years old')
    .max(70, 'Age must be 70 or below')
    .refine((v) => typeof v === 'number' && !Number.isNaN(v), {
      message: 'Age must be a number',
    }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  nativePlace: z.string().min(1, 'Native place is required'),
  educationLevel: z.string().min(1, 'Education level is required'),
  politicalStatus: z.string().optional(),
  healthStatus: z.string().min(1, 'Health status is required'),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Separated']),
  idNumber: z
    .string()
    .min(5, 'ID number must be at least 5 characters')
    .max(30, 'ID number too long'),
  idCardType: z.string().min(1, 'ID card type is required'),
  sitio: z.string().min(2, 'Sitio is required'),
  barangay: z.string().min(2, 'Barangay is required'),
  municipality: z.string().min(2, 'Municipality is required'),
  province: z.string().min(2, 'Province is required'),
  contactNumber: z
    .string()
    .regex(/^09\d{9}$/, 'Phone number must be in format 09XXXXXXXXX'),
  homePhone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelation: z.string().min(1, 'Relation is required'),
  emergencyContact: z
    .string()
    .regex(/^09\d{9}$/, 'Must be a valid phone number (09XXXXXXXXX)'),
  emergencyAddress: z.string().min(5, 'Address is required'),
  volunteeringExperience: z.string().optional(),
});

export const applicationStep2Schema = z.object({
  validIdFrontUrl: z.string().min(1, 'Valid ID front view is required'),
  validIdBackUrl: z.string().min(1, 'Valid ID back view is required'),
  trainingCertUrl: z.string().min(1, 'Training certificate is required').max(5),
  barangayClearanceUrl: z.string().min(1, 'Barangay clearance is required'),
  medicalCertUrl: z.string().min(1, 'Medical certificate is required').max(5),
  photoUrl: z.string().min(1, 'Profile Picture is required'),
});

export const fullApplicationSchema = applicationStep1Schema.merge(
  applicationStep2Schema,
);

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────

export const announcementSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title too long'),
  body: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(5000, 'Body too long'),
  type: z.enum(['info', 'urgent', 'warning', 'success']),
  tags: z.array(z.string()).default([]),
  expiresAt: z.string().optional(),
  repeatBroadcast: z.boolean().default(false),
  broadcastFrequency: z
    .enum(['Daily', 'Weekly', 'Bi-weekly', 'Monthly'])
    .optional(),
});

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────

export const adminProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminChangePasswordInput = z.infer<
  typeof adminChangePasswordSchema
>;
export type ApplicationStep1Input = z.infer<typeof applicationStep1Schema>;
export type ApplicationStep2Input = z.infer<typeof applicationStep2Schema>;
export type FullApplicationInput = z.infer<typeof fullApplicationSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type AdminProfileInput = z.infer<typeof adminProfileSchema>;
