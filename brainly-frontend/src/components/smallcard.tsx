import Youtube from "react-youtube-embed";
import { motion } from "motion/react";
interface smallcardProps {
  title: string;
  link: string;
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
      className="w-56 border border-black max-h-sm p-4 rounded-md bg-white transition-all duration-300 ease-in-out hover:w-64"
    >
      <div>{props.title}</div>
      <Youtube id={props.link} />
    </motion.div>
  );
}
