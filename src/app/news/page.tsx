export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getAllNews } from "@/lib/news";
import { NewsFeed } from "@/components/news/NewsFeed";

export const metadata: Metadata = {
  title: "News — DevMarket",
  description: "Explore developer news, engineering insights, and trending articles from the DevMarket newsroom.",
  openGraph: {
    title: "News — DevMarket",
    description: "Explore developer news, engineering insights, and trending articles from the DevMarket newsroom.",
    url: "https://devmarket.example.com/news",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "News — DevMarket",
    description: "Explore developer news, engineering insights, and trending articles from the DevMarket newsroom.",
  },
};

export default function NewsPage() {
  const articles = getAllNews();

  return <NewsFeed articles={articles} />;
}
