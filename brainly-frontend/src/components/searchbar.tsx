import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGetCards } from "../hooks/getcards";
import { Smallcard } from "./smallcard";
import { motion } from "motion/react";
import { FilterArr } from "../types/filterArrType";
import { BrainIconAnimated } from "../icons/brainIconAnimated";
import { Inputcomp } from "./inputcom";
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
      // const filteredarr = data.filter(function (element: { _id: string }) {
      //   return answer.filtered.includes(element._id);
      // });
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
    const response = await fetch("http://localhost:3000/api/v1/content/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? token : "",
      },
      body: JSON.stringify({ queryquestion: inputrefs }),
    });
    return response.json();
  }
  function onclicksearch() {
    mutation.mutate();
  }
  return (
    <motion.div layout transition={{ duration: 0.45, ease: "easeInOut" }}>
      <div className="w-full mt-4 mx-auto px-4 py-6 rounded-md bg-zinc-900 text-neutral-300">
        <div className="flex items-center justify-center gap-8">
          <BrainIconAnimated size="size-10" />
          <div className="flex-grow">
            <Inputcomp
              reference={inputref}
              placeholder={props.placeholder}
            ></Inputcomp>
          </div>
          <button
            className="bg-blue-800 text-neutral-200 text-shadow-md px-8 py-2 rounded-lg hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101"
            onClick={onclicksearch}
          >
            ask
          </button>
        </div>
        {ans ? (
          <div className="p-4">
            <div className="flex gap-2">
              {filterarr?.map((item: any) => {
                return (
                  <Smallcard
                    link={item.link}
                    title={item.title}
                    key={item._id}
                    contenttype={item.contenttype}
                  />
                );
              })}
            </div>
            <motion.div
              key={ansbody}
              initial={{
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="bg-background text-neutral-200 rounded-md p-4 mt-2"
            >
              <div className="whitespace-pre-wrap">{ansbody}</div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
