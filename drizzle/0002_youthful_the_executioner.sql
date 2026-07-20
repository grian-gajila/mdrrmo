ALTER TABLE "volunteer_applications" ADD COLUMN "sitio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD COLUMN "barangay" text NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD COLUMN "municipality" text NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD COLUMN "province" text NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_applications" DROP COLUMN "current_address";