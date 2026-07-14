CREATE TYPE "public"."announcement_type" AS ENUM('info', 'urgent', 'warning', 'success');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('pending', 'under_review', 'approved', 'rejected');--> statement-breakpoint
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
CREATE TABLE "volunteer_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"volunteer_id" uuid NOT NULL,
	"gender" text NOT NULL,
	"age" integer NOT NULL,
	"date_of_birth" text NOT NULL,
	"nationality" text DEFAULT 'Filipino' NOT NULL,
	"native_place" text NOT NULL,
	"education_level" text NOT NULL,
	"political_status" text,
	"health_status" text NOT NULL,
	"marital_status" text NOT NULL,
	"id_number" text NOT NULL,
	"id_card_type" text NOT NULL,
	"current_address" text NOT NULL,
	"contact_number" text NOT NULL,
	"home_phone" text,
	"emergency_contact" jsonb,
	"valid_id_url" text,
	"training_cert_url" text,
	"barangay_clearance_url" text,
	"medical_cert_url" text,
	"photo_url" text,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"review_notes" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
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
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_volunteer_id_volunteer_profiles_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD CONSTRAINT "volunteer_applications_reviewed_by_admin_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;