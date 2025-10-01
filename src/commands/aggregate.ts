import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss";
import { parseDuration } from "src/lib/time";
import { NewPost } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenReqs = args[0];
  const timeBetweenReqsNum = parseDuration(timeBetweenReqs);

  console.log(`Collecting feeds every ${timeBetweenReqs}`);

  await scrapeFeeds().catch(handleError);

  const interval = setInterval(async () => {
    await scrapeFeeds().catch(handleError);
  }, timeBetweenReqsNum);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  let feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("Error: No feeds found");
    return;
  }

  feed = await markFeedFetched(feed.id);
  
  if (!feed) {
    console.log("Error: No feeds found to mark as fetched");
    return;
  }

  const feedData = await fetchFeed(feed.url);

  console.log(`Feed ${feed.name} found, contains ${feedData.channel.item.length} posts`);

  for (const item of feedData.channel.item) {
    const now = new Date();

    await createPost({
      url: item.link,
      feedId: feed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    } satisfies NewPost);
  }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}