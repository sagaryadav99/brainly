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
  id: string;
  title?: string;
  link: string;
  tags?: [];
  summary?: string;
  summaryStatus?: string;
  note?: string;
  hidden: boolean;
}

export function MainBigCard(props: cardprops) {
  return (
    <motion.div
      className="flex w-[390px] md:w-auto flex-col justify-between text-neutral-400 bg-zinc-900 outline outline-zinc-800 p-2 rounded-md pointer-events-auto shadow-[0_6px_14px_-4px_oklch(30%_0_0_/_0.45)] overflow-hidden"
      layoutId={`card-${props.id}`}
      style={{
        willChange: "transform, opacity",
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 1,
        scale: 0.5,
        filter: "blur(5px)",
        transition: {
          duration: 0.1,
          ease: "easeInOut",
        },
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300 font-bold tracking-wide">
          <Notebookicon />
          {props.title}
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Shareicon />
          {props.hidden ? null : <Deleteicon contentid={props.id} />}
        </div>
      </div>
      <div className="my-2">
        {props.variant == "youtube" ? (
          <div className="md:w-md h-2xl">
            <div className="rounded-xl overflow-hidden relative after:content-[''] after:inset-0 after:absolute after:w-full after:h-full after:opacity-40 after:bg-black after:pointer-events-none">
              <YoutubeComp videoId={props.link} variant="bigcard" />
            </div>
          </div>
        ) : props.variant == "note" ? (
          <div className="md:w-md h-[165px] flex flex-col justify-center">
            <NoteText text={props.note ? props.note : ""} />
            <div className="text-right">
              <a
                href={props.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                go to link
              </a>
            </div>
          </div>
        ) : (
          <div className="md:w-md h-[165px]">
            <MytweetComp id={props.link} variant="bigcard" />
          </div>
        )}
      </div>
      {props.tags?.length != 0 ? (
        <div className="flex gap-0">
          {props.tags?.map((item, index: number) => {
            return <Tagtile key={index} tagcontent={item} zindex={index} />;
          })}
        </div>
      ) : null}
      <div className="mt-2">
        {props.summaryStatus === "pending" ? (
          <Sumloading />
        ) : (
          <Summarybox
            modified={props.summary}
            objid={props.id}
            hidden={props.hidden}
          />
        )}
      </div>
    </motion.div>
  );
}
