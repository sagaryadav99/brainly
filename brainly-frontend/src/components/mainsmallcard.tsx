import { Deleteicon } from "../icons/deleteicon";
import { Notebookicon } from "../icons/notebookicon";
import { Shareicon } from "../icons/shareicone";
import { Tagtile } from "./tagtile";
import { NoteText } from "./notetext";
import { YoutubeComp } from "./youtubecom";
import { MytweetComp } from "./twittercom";
import { motion } from "motion/react";
import { LoaderCircle } from "../icons/loader";

interface cardprops {
  variant?: "youtube" | "twitter" | "note";
  id: string;
  title?: string;
  link: string;
  tags?: [];
  summary?: string;
  summaryStatus?: string;
  note?: string;
  isexpanding: boolean;
  hidden: boolean;
}

export function MainSmallCard(props: cardprops) {
  return (
    <motion.div
      className="flex flex-col justify-between text-neutral-400 bg-zinc-900 outline outline-black p-2 rounded-md shadow-[0_6px_14px_-4px_rgba(0,0,0,1)] overflow-hidden hover:-translate-y-1 transition-translate duration-300 ease-in-out"
      layoutId={`card-${props.id}`}
      style={{
        willChange: "transform, opacity",
        zIndex: props.isexpanding ? 999 : 1,
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
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {props.summaryStatus === "pending" && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 37%, transparent 63%)",
            backgroundSize: "200% 100%",
          }}
          initial={{ backgroundPositionX: "200%" }}
          animate={{ backgroundPositionX: "0%" }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300 font-bold tracking-wide bg-transparent">
          <Notebookicon />
          {props.summaryStatus === "pending" ? (
            <div className="flex items-center gap-2">
              summarising
              <LoaderCircle />
            </div>
          ) : (
            <div className="leading-4">{props.title}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Shareicon />
          {props.hidden ? null : <Deleteicon contentid={props.id} />}
        </div>
      </div>
      <div className="my-2">
        {props.variant == "youtube" ? (
          <div className="rounded-xl overflow-hidden relative after:content-[''] after:inset-0 after:absolute after:w-full after:h-full after:opacity-40 after:bg-black after:pointer-events-none">
            <YoutubeComp videoId={props.link} variant="bigcard" />
          </div>
        ) : props.variant == "note" ? (
          <div className="h-[165px] w-full pb-2">
            <NoteText text={props.note ? props.note : ""} />
            <div className="text-right">
              <a
                href={props.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                go to link
              </a>
            </div>
          </div>
        ) : (
          <MytweetComp id={props.link} variant="bigcard" />
        )}
      </div>
      {props.tags?.length != 0 ? (
        <div className="flex gap-0">
          {props.tags?.map((item, index: number) => {
            return <Tagtile key={index} tagcontent={item} zindex={index} />;
          })}
        </div>
      ) : null}
    </motion.div>
  );
}
