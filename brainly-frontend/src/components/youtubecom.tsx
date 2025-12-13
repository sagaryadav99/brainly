import { useState } from "react";
import { YtPlayButton } from "../icons/playbutton";

export function YoutubeComp({ videoId }: { videoId: string }) {
  const [ytiframe, setIframe] = useState(false);
  function onclickhandler(e) {
    e.stopPropagation();
    setIframe((x) => !x);
  }
  return (
    <>
      {ytiframe ? (
        <iframe
          width="100%"
          height="165px"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=0&rel=0`}
          allowFullScreen
          allow="autoplay; encrypted-media"
          title="Embedded YouTube Video"
        ></iframe>
      ) : (
        <div
          onClick={onclickhandler}
          className="cursor-pointer w-[100%] h-[165px] relative"
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
