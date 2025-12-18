import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";
import { aiparser } from "../utils/aiparser";

export function TextComp({ ansbody }: { ansbody: string }) {
  const modifiedText = aiparser(ansbody);
  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: "blur(0px)", y: 0 },
      {
        duration: 0.3,
        ease: "easeInOut",
        delay: stagger(0.025),
      }
    );
  }, []);
  return (
    <div ref={scope}>
      {modifiedText.map((item, idx) => {
        if (item.type === "Heading") {
          return (
            <motion.h1 key={idx + item.type} className="text-xl font-bold">
              {item.content.split(" ").map((word, index) => {
                return (
                  <motion.span
                    key={index + word}
                    style={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  >
                    {word}{" "}
                  </motion.span>
                );
              })}
            </motion.h1>
          );
        }
        if (item.type == "bullet") {
          return (
            <motion.div>
              {item.content.map((item, idx) => {
                return (
                  <motion.div
                    key={idx + item[1]}
                    className="py-1 tracking-wide flex items-start"
                  >
                    {" "}
                    <motion.span
                      style={{ opacity: 0, y: 10 }}
                      className="text-lg leading-none px-2 inline-block"
                    >
                      •
                    </motion.span>
                    <div>
                      {item.split(" ").map((word, index) => {
                        return (
                          <motion.span
                            key={index + word}
                            style={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                          >
                            {word}{" "}
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        }
        if (item.type == "paragraph") {
          return (
            <motion.span
              key={item.type + idx}
              className="text-base font-medium"
            >
              {item.content.split(" ").map((word, index) => {
                return (
                  <motion.span
                    key={index + word}
                    style={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  >
                    {word}{" "}
                  </motion.span>
                );
              })}
            </motion.span>
          );
        }
      })}
    </div>
  );
}
