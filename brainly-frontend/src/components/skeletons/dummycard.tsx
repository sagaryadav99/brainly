import { Deleteicon } from "../../icons/deleteicon";
import { Notebookicon } from "../../icons/notebookicon";
import { Shareicon } from "../../icons/shareicone";
import StartIcon from "../../icons/starticon";

import { motion } from "motion/react";

export function DummyCard({ openfn }: { openfn: () => void }) {
  function onclickhandler() {
    openfn();
  }
  return (
    <motion.div
      className="flex flex-col justify-between text-neutral-400 bg-zinc-900 outline outline-zinc-800 p-2 rounded-md cursor-pointer hover:scale-102 transition-all duration-300 ease-in-out"
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
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onClick={onclickhandler}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300 font-bold tracking-wide">
          <Notebookicon />
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Shareicon />
          <Deleteicon contentid="dummy" />
        </div>
      </div>
      <div className="my-2">
        <div className="h-[165px] w-full pb-2 border border-2 border-neutral-600 border-dashed rounded-md flex justify-center items-center gap-4 group">
          <div className="group-hover:scale-120 transition-all duration-300 ease-in-out">
            <StartIcon />
          </div>
          <div className="group-hover:scale-110 group-hover:text-neutral-200 text-neutral-300 text-lg transition-all duration-300 ease-in-out">
            click here to get started
          </div>
        </div>
      </div>
    </motion.div>
  );
}
