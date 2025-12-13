import { Deleteicon } from "../icons/deleteicon";
import { Notebookicon } from "../icons/notebookicon";
import { Shareicon } from "../icons/shareicone";
import { Tagtile } from "./tagtile";
import { Summarybox } from "./summary";
import { Sumloading } from "./sumloading";
import { NoteText } from "./notetext";
import { YoutubeComp } from "./youtubecom";
import { MytweetComp } from "./twittercom";
import { motion } from "motion/react";

interface cardprops {
  variant?: "youtube" | "twitter" | "note";
  id?: string;
  title?: string;
  link?: string;
  tags?: [];
  summary?: string;
  summaryStatus?: string;
  note?: string;
}

export function Card(props: cardprops) {
  return (
    <motion.div
      className="flex flex-col justify-between text-neutral-400 bg-zinc-900 outline outline-zinc-800 p-2 rounded-md"
      layoutId={`card-${props.id}`}
      style={{ willChange: "transform, opacity" }}
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.1,
          ease: "easeInOut",
        },
      }}
      exit={{
        opacity: 1,
        scale: 0.5,
        filter: "blur(5px)",
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300 font-bold tracking-wide">
          <Notebookicon />
          {props.title}
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Shareicon />
          <Deleteicon contentid={props.id} />
        </div>
      </div>
      <div className="mt-2 mb-4">
        {props.variant == "youtube" ? (
          <div className="rounded-xl overflow-hidden relative after:content-[''] after:inset-0 after:absolute after:w-full after:h-full after:opacity-40 after:bg-black after:pointer-events-none">
            <YoutubeComp videoId={props.link} />
          </div>
        ) : props.variant == "note" ? (
          <div className="h-full w-full">
            <NoteText text={props.note ? props.note : ""} />
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              go to link
            </a>
          </div>
        ) : (
          // <div className="h-[150px] w-full no-scrollbar overflow-y-auto rounded-xl tweet-container">
          //   <div className="relative -top-5 -mb-8">
          //     <Tweet id={props.link} />
          //   </div>
          // </div>
          <MytweetComp id={props.link} variant="bigcard" />
        )}
      </div>
      {props.tags?.length != 0 ? (
        <div className="m-2">
          {props.tags?.map((item, index: number) => {
            return <Tagtile key={index} tagcontent={item} />;
          })}
        </div>
      ) : null}
      <div>
        {props.summaryStatus === "pending" ? (
          <Sumloading />
        ) : (
          <Summarybox modified={props.summary} objid={props.id} />
        )}
      </div>
    </motion.div>
  );
}
