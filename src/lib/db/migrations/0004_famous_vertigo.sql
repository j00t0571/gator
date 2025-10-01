DROP INDEX "user_feed_unique";--> statement-breakpoint
ALTER TABLE "feed_follows" ADD CONSTRAINT "feed_follows_user_id_feed_id_unique" UNIQUE("user_id","feed_id");