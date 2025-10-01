ALTER TABLE "feeds" ALTER COLUMN "last_fetched_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "last_fetched_at" DROP NOT NULL;