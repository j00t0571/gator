import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2;

    if (args.length === 1) {
        let limitArg = parseInt(args[0]);

        if (limitArg) {
            limit = limitArg;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`);
        }
    }
    
    const userPosts = await getPostsForUser(user.id, limit);

    console.log(`Found ${userPosts.length} posts for ${user.name}${userPosts.length > 0 ? ':' : ''}`);

    for (const post of userPosts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
}