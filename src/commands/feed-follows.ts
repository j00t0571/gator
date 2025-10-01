import { getFeedByURL } from "src/lib/db/queries/feeds";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed-follows";
import { User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, currentUser: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error(`Feed not found: ${url}`);
    }

    const feedFollow = await createFeedFollow(currentUser.id, feed.id);
    
    console.log(`Feed follow created:`);

    printFeedFollow(currentUser.name, feed.name);
}

export async function handlerFollowing(_: string, currentUser: User) {
    const feeds = await getFeedFollowsForUser(currentUser.id);

    if (feeds.length === 0) {
        console.log(`No feed follows found for this user.`);
        return;
    }

    console.log(`Feed follows for user %s:`, currentUser.id);

    for (let feed of feeds) {
        console.log(`* %s`, feed.feedName);
    }
}

export async function handlerUnfollow(cmdName: string, currentUser: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedByURL(url);

    if (!feed) {
        throw new Error(`Feed not found for url: ${url}`);
    }

    const result = await deleteFeedFollow(currentUser.id, feed.id);
    if (!result) {
        throw new Error(`Failed to unfollow feed: ${url}`);
    }

    console.log(`%s unfollowed successfully!`, feed.name);
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}