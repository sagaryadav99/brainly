import { useTweet } from "react-tweet";
import type { Tweet } from "react-tweet/api";
import { useEffect, useState } from "react";

interface MyTweetProp {
  id: string;
  variant: "smallcard" | "bigcard";
}

export function Mytweet({ id, variant }: MyTweetProp) {
  const [tweet, setTweet] = useState<Tweet | null>(null);

  const { data, isLoading, error } = useTweet(id);
  useEffect(() => {
    if (data) setTweet(data);
    console.log(data);
  }, [data]);

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading tweet.</div>;

  if (!tweet) return <div>No tweet found</div>;

  if (variant === "smallcard") {
    return <div>{tweet.text}</div>;
  }

  return <div>{tweet.user.screen_name}</div>;
}
