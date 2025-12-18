import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGetCards } from "../hooks/getcards";
import { Smallcard } from "./smallcard";
import { AnimatePresence, motion } from "motion/react";
import { FilterArr } from "../types/filterArrType";
import { BrainIconAnimated } from "../icons/brainIconAnimated";
import { LoaderCircle } from "../icons/loader";
import { TextComp } from "./textcomp";
interface searchbar {
  placeholder: string;
}
export function Searchbar(props: searchbar) {
  const inputref = useRef<HTMLInputElement>(null);
  const [ans, setAns] = useState(false);
  const [ansbody, setAnsbody] = useState("");
  const [filterarr, setFilterarr] = useState<FilterArr[]>();
  const { data } = useGetCards();
  const mutation = useMutation({
    mutationFn: searchfunc,
    onSuccess: (answer) => {
      setAns(true);
      setAnsbody(answer.reply);
      const finalArr: FilterArr[] = [];
      answer.filtered.forEach(function (item: string) {
        data.forEach(function (element: FilterArr) {
          if (element._id == item) {
            console.log(element);
            finalArr.push(element);
          }
        });
      });
      console.log(finalArr);
      setFilterarr(finalArr);
    },
  });
  async function searchfunc() {
    const token = localStorage.getItem("token");
    const inputrefs = inputref.current?.value;
    const response = await fetch(
      "http://192.168.1.8:3000/api/v1/content/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token ? token : "",
        },
        body: JSON.stringify({ queryquestion: inputrefs }),
      }
    );
    return response.json();
  }
  const parentVariant = {
    open: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
    close: {
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1,
      },
    },
  };
  const childVariant = {
    close: { opacity: 0, x: 100, scale: 1 },
    open: { opacity: 1, x: 0, scale: 0.98 },
  };
  function onclicksearch(e) {
    e.preventDefault();
    mutation.mutate();
  }
  return (
    <div>
      <div className="w-full mt-4 mx-auto px-1 md:px-2 lg:px-4 py-2 md:py-4 lg:py-6 rounded-xl bg-zinc-900 text-neutral-300 border-2 border-black">
        <form className="flex items-center justify-center gap-2 md:gap-4 lg:gap-8">
          <BrainIconAnimated size="size-8 lg:size-10" />
          <div className="flex-grow">
            <input
              ref={inputref}
              placeholder={props.placeholder}
              className="w-full px-1 py-1 lg:px-2 lg:py-2 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all"
            ></input>
          </div>
          <button
            className="w-[160px] md:w-[200px] lg:w-[220px] bg-blue-800 text-neutral-300 text-shadow-md text-small md:text-base tracking-tight md:tracking-wide font-bold px-2 md:px-4 lg:px-8 py-1 md:py-2 rounded-md md:rounded-lg hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101"
            onClick={onclicksearch}
            type="submit"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2 justify-center">
                Exploring <LoaderCircle />
              </span>
            ) : (
              "Explore Your Mind!"
            )}
          </button>
        </form>
        <AnimatePresence initial={false}>
          {ans ? (
            <div className="mt-2">
              <motion.div
                key={filterarr?.map((item) => item._id).join("-")}
                layout
                className="flex md:gap-2 overflow-x-auto no-scrollbar"
                variants={parentVariant}
                initial="close"
                animate="open"
              >
                {filterarr?.map((item: any) => {
                  return (
                    <motion.div variants={childVariant}>
                      <Smallcard
                        link={item.link}
                        title={item.title}
                        key={item._id}
                        contenttype={item.contenttype}
                        note={item.note}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
              <motion.div
                layout
                key={ansbody}
                initial={{
                  opacity: 0,
                  filter: "blur(5px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
                className="bg-[#212121] text-zinc-300 rounded-xl p-4 mt-2 border border-2 border-black"
              >
                <TextComp ansbody={ansbody} />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
