import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { printFeedFollow } from "./feed-follows";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";

export async function handlerAddFeed(cmdName: string, currentUser: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const feedName = args[0];
    const url = args[1];
    const feed = await createFeed(feedName, url, currentUser.id);

    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    const feedFollow = await createFeedFollow(currentUser.id, feed.id);

    printFeedFollow(currentUser.name, feedFollow.feedName);

    console.log("Feed created successfully:");

    printFeed(feed, currentUser);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();

    if (feeds.length === 0) {
        console.log(`No feeds found.`);
        return;
    }

    console.log(`Found %d feeds:\n`, feeds.length);

    for (const feed of feeds) {
        const user = await getUserById(feed.userId);

        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }

        printFeed(feed, user);
        console.log(`=====================================`);
    }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}