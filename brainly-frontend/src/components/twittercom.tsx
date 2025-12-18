import { useTweet } from "react-tweet";
import type { Tweet } from "react-tweet/api";
import { useEffect, useState } from "react";
import { Twittericon } from "../icons/twitterIcon";
import { VerifiedIcon } from "../icons/verifiedicon";

interface MyTweetProp {
  id: string;
  variant: "smallcard" | "bigcard";
}

export function MytweetComp({ id, variant }: MyTweetProp) {
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [long, setLong] = useState(false);
  const { data, isLoading, error } = useTweet(id);
  useEffect(() => {
    if (data) {
      if (data.text.indexOf("https") !== -1) {
        setLong(true);
        const firstindex = data.text.indexOf("https");
        data.text = data.text.slice(0, firstindex);
      }
      setTweet(data);
    }
  }, [data]);
  function onclickhandler(e) {
    e.stopPropagation();
  }
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading tweet.</div>;

  if (!tweet) return <div>No tweet found</div>;

  return (
    <div
      className={`w-full ${
        variant == "smallcard"
          ? "h-[120px] border border-2 border-black"
          : "h-[165px]"
      } bg-background rounded-lg px-2 py-2 overflow-hidden no-scrollbar overflow-y-auto`}
    >
      <div className="flex justify-start items-center">
        <img
          src={tweet.user.profile_image_url_https}
          className={`rounded-full ${
            variant == "smallcard" ? "size-5" : "size-8"
          }`}
        ></img>
        <div className="grow-1 pl-1 flex flex-col">
          <div className="flex items-center text-lg h-5">
            <div
              className={`${
                variant == "smallcard" ? "text-sm" : "tracking-wide"
              } text-neutral-200`}
            >
              {tweet.user.screen_name}
            </div>
            {tweet.user.is_blue_verified && (
              <div>
                <VerifiedIcon />
              </div>
            )}
          </div>
          <div className="text-neutral-500 text-xs tracking-tighter">
            @{tweet.user.name}
          </div>
        </div>
        <div className="tweet icon" onClick={onclickhandler}>
          <a
            href={`https://x.com/${tweet.user.name}/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twittericon />
          </a>
        </div>
      </div>
      <div className="tracking-tight mt-2 text-neutral-200">
        {tweet.text}
        {long ? (
          <a
            href={`https://x.com/${tweet.user.name}/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {" "}
            ...see more
          </a>
        ) : null}
      </div>
    </div>
  );
}
