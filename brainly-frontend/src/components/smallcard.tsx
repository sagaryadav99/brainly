import Youtube from "react-youtube-embed";
import { motion } from "motion/react";
import { Mytweet } from "./reactTweet";
interface smallcardProps {
  title: string;
  link: string;
  contenttype: string;
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
      className="w-56 border h-48 border-black p-4 rounded-md bg-background text-neutral-300 overflow-hidden"
    >
      <div>{props.title}</div>
      {props.contenttype == "youtube" ? (
        <Youtube id={props.link} />
      ) : (
        <Mytweet id={props.link} variant="smallcard" />
      )}
    </motion.div>
  );
}
