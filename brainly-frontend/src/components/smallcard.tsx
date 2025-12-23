import { motion } from "motion/react";
import { YoutubeComp } from "./youtubecom";
import { MytweetComp } from "./twittercom";
import { NoteText } from "./notetext";
interface smallcardProps {
  title: string;
  link: string;
  contenttype: string;
  note: string;
}
export function Smallcard(props: smallcardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
        filter: "blur(10px)",
      }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="w-56 border h-auto border-2 border-black p-2 rounded-xl bg-[#212121] text-neutral-300 overflow-hidden relative hover:scale-102 transition-all duration-200 ease-in-out"
    >
      <div className="pb-1 font-bold text-base text-neutral-300 leading-4">
        {props.title}
      </div>
      {props.contenttype == "youtube" ? (
        <div className="rounded-xl border border-black border-2 overflow-hidden relative after:content-[''] after:inset-0 after:absolute after:w-full after:h-full after:opacity-40 after:bg-black after:cursor-pointer after:pointer-events-none">
          <YoutubeComp videoId={props.link} variant="smallcard" />
        </div>
      ) : props.contenttype == "twitter" ? (
        <MytweetComp id={props.link} variant="smallcard" />
      ) : (
        <div className="text-xs h-[120px] hover:cursor-pointer">
          <a href={props.link} target="_blank" rel="noopener noreferer">
            <NoteText text={props.note} />
          </a>
        </div>
      )}
    </motion.div>
  );
}
