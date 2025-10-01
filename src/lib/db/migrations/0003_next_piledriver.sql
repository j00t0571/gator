ALTER TABLE "feed_follows" DROP CONSTRAINT "feed_follows_user_id_unique";--> statement-breakpoint
ALTER TABLE "feed_follows" DROP CONSTRAINT "feed_follows_feed_id_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "user_feed_unique" ON "feed_follows" USING btree ("user_id","feed_id");