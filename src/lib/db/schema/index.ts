import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const applicationStatusEnum = pgEnum('application_status', [
  'pending',
  'under_review',
  'approved',
  'rejected',
]);

export const announcementTypeEnum = pgEnum('announcement_type', [
  'info',
  'urgent',
  'warning',
  'success',
]);

export const volunteerStatusEnum = pgEnum('volunteer_status', [
  'active',
  'inactive',
  'suspended',
]);

export const volunteerProfiles = pgTable('volunteer_profiles', {
  id: uuid('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const volunteerApplications = pgTable('volunteer_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  volunteerId: uuid('volunteer_id')
    .references(() => volunteerProfiles.id, { onDelete: 'cascade' })
    .notNull(),

  firstName: text('first_name').notNull(),
  middleName: text('middle_name').notNull(),
  lastName: text('last_name').notNull(),
  gender: text('gender').notNull(),
  age: integer('age').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  nationality: text('nationality').notNull().default('Filipino'),
  nativePlace: text('native_place').notNull(),
  educationLevel: text('education_level').notNull(),
  politicalStatus: text('political_status'),
  healthStatus: text('health_status').notNull(),
  maritalStatus: text('marital_status').notNull(),

  idNumber: text('id_number').notNull(),
  idCardType: text('id_card_type').notNull(),

  sitio: text('sitio').notNull(),
  barangay: text('barangay').notNull(),
  municipality: text('municipality').notNull(),
  province: text('province').notNull(),
  contactNumber: text('contact_number').notNull(),
  homePhone: text('home_phone'),
  email: text('email').notNull(),

  emergencyContact: jsonb('emergency_contact').$type<{
    name: string;
    relation: string;
    contactNumber: string;
    address: string;
  }>(),

  volunteeringExperience: text('volunteering_experience'),

  validIdUrl: text('valid_id_url'),
  trainingCertUrl: text('training_cert_url'),
  barangayClearanceUrl: text('barangay_clearance_url'),
  medicalCertUrl: text('medical_cert_url'),
  photoUrl: text('photo_url'),

  status: applicationStatusEnum('status').default('pending').notNull(),
  reviewedBy: integer('reviewed_by').references(() => adminUsers.id),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),

  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const hiredVolunteers = pgTable('hired_volunteers', {
  id: uuid('id').primaryKey().defaultRandom(),
  volunteerId: uuid('volunteer_id')
    .references(() => volunteerProfiles.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  applicationId: uuid('application_id')
    .references(() => volunteerApplications.id)
    .notNull(),
  role: text('role').notNull(),
  status: volunteerStatusEnum('status').default('active').notNull(),
  hiredAt: timestamp('hired_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deploymentCount: integer('deployment_count').default(0),
  trainings: jsonb('trainings').$type<string[]>().default([]),
  hiredBy: integer('hired_by').references(() => adminUsers.id),
});

export const adminUsers = pgTable('admin_users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(), // bcrypt
  displayName: text('display_name').notNull(),
  email: text('email'),
  role: text('role').default('admin').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: announcementTypeEnum('type').default('info').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  repeatBroadcast: boolean('repeat_broadcast').default(false),
  broadcastFrequency: text('broadcast_frequency'),
  createdBy: integer('created_by').references(() => adminUsers.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
