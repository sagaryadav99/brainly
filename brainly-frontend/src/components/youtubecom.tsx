import { useState } from "react";
import { YtPlayButton } from "../icons/playbutton";

export function YoutubeComp({
  videoId,
  variant,
}: {
  videoId: string;
  variant: string;
}) {
  const [ytiframe, setIframe] = useState(false);
  function onclickhandler(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIframe((x) => !x);
  }
  return (
    <>
      {ytiframe ? (
        <iframe
          width="100%"
          height={variant == "bigcard" ? "165px" : "120px"}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=0&rel=0`}
          allowFullScreen
          allow="autoplay; encrypted-media"
          title="Embedded YouTube Video"
        ></iframe>
      ) : (
        <div
          onClick={onclickhandler}
          className={`cursor-pointer w-[100%] ${
            variant == "bigcard" ? "h-[165px]" : "h-[120px]"
          } relative`}
        >
          <div className="absolute inset-0 flex justify-center items-center z-100 hover:scale-105 transition-all duration-200">
            <YtPlayButton />
          </div>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            width="100%"
            height="100%"
          ></img>
        </div>
      )}
    </>
  );
}
