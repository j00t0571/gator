import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        }
    });
    
    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const parser: XMLParser = new XMLParser();
    const parsedText = parser.parse(text);
    const channel = parsedText.rss?.channel;

    if (
        !channel ||
        !channel.title ||
        !channel.link ||
        !channel.description ||
        !channel.item
    ) {
        throw new Error("failed to parse channel");
    }

    const items: any[] = Array.isArray(channel.item)
        ? channel.item
        : [channel.item];
    const rssItems: RSSItem[] = [];

    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        });
    }

    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems
        }
    };
}