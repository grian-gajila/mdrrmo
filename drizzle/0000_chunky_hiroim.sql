CREATE TYPE "public"."announcement_status" AS ENUM('draft', 'scheduled', 'published');--> statement-breakpoint
CREATE TYPE "public"."announcement_type" AS ENUM('info', 'urgent', 'warning', 'success');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('draft', 'pending', 'under_review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."employment_status" AS ENUM('Employed', 'Unemployed');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female', 'Prefer not to say');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('Single', 'Married', 'Widowed', 'Annulment');--> statement-breakpoint
CREATE TYPE "public"."volunteer_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"type" "announcement_type" DEFAULT 'info' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"repeat_broadcast" boolean DEFAULT false,
	"status" "announcement_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp,
	"published_at" timestamp,
	"broadcast_frequency" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hired_volunteers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"volunteer_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"role" text NOT NULL,
	"status" "volunteer_status" DEFAULT 'active' NOT NULL,
	"hired_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deployment_count" integer DEFAULT 0,
	"trainings" jsonb DEFAULT '[]'::jsonb,
	"hired_by" integer,
	CONSTRAINT "hired_volunteers_volunteer_id_unique" UNIQUE("volunteer_id")
);
--> statement-breakpoint
CREATE TABLE "notification_reads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"volunteer_id" uuid NOT NULL,
	"announcement_id" uuid NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_reads_volunteer_announcement_unique" UNIQUE("volunteer_id","announcement_id")
);
--> statement-breakpoint
CREATE TABLE "volunteer_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"volunteer_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender" "gender" NOT NULL,
	"age" integer NOT NULL,
	"date_of_birth" text NOT NULL,
	"nationality" text DEFAULT 'Filipino' NOT NULL,
	"native_place" text NOT NULL,
	"education_level" text NOT NULL,
	"marital_status" "marital_status" NOT NULL,
	"employment_status" "employment_status" NOT NULL,
	"nature_of_employment" text,
	"position" text,
	"employer" text,
	"primary_role" text NOT NULL,
	"secondary_role" text NOT NULL,
	"id_number" text NOT NULL,
	"id_card_type" text NOT NULL,
	"complete_address" text NOT NULL,
	"province_code" text NOT NULL,
	"municipality_code" text NOT NULL,
	"barangay_code" text NOT NULL,
	"contact_number" text NOT NULL,
	"home_phone" text,
	"email" text NOT NULL,
	"emergency_contact" jsonb,
	"volunteering_experience" text,
	"valid_id_front_url" text,
	"valid_id_back_url" text,
	"training_cert_url" jsonb,
	"photo_url" text,
	"status" "application_status" DEFAULT 'draft' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"review_notes" text,
	"submitted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteer_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "volunteer_profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hired_volunteers" ADD CONSTRAINT "hired_volunteers_volunteer_id_volunteer_profiles_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hired_volunteers" ADD CONSTRAINT "hired_volunteers_application_id_volunteer_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."volunteer_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hired_volunteers" ADD CONSTRAINT "hired_volunteers_hired_by_admin_users_id_fk" FOREIGN KEY ("hired_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_volunteer_id_volunteer_profiles_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_announcement_id_announcements_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_volunteer_id_volunteer_profiles_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_reviewed_by_admin_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;