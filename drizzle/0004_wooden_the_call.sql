ALTER TABLE "volunteer_applications" ADD COLUMN "valid_id_front_url" text;--> statement-breakpoint
ALTER TABLE "volunteer_applications" ADD COLUMN "valid_id_back_url" text;--> statement-breakpoint
ALTER TABLE "volunteer_applications" DROP COLUMN "valid_id_url";