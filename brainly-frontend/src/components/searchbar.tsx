import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGetCards } from "../hooks/getcards";
import { Smallcard } from "./smallcard";
import { motion } from "motion/react";
interface searchbar {
  placeholder: string;
}
export function Searchbar(props: searchbar) {
  const inputref = useRef<HTMLInputElement>(null);
  const [ans, setAns] = useState(false);
  const [ansbody, setAnsbody] = useState("");
  const [filterarr, setFilterarr] = useState([]);
  const { data } = useGetCards();
  const mutation = useMutation({
    mutationFn: searchfunc,
    onSuccess: (answer) => {
      setAns(true);
      setAnsbody(answer.reply);
      const filteredarr = data.filter((element: { _id: string }) =>
        answer.filtered.includes(element._id)
      );
      setFilterarr(filteredarr);
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
      <div className="w-5xl mt-4 p-6 rounded-md bg-stone-300">
        <div className="flex items-center">
          <input
            ref={inputref}
            placeholder={props.placeholder}
            className="w-3xl border border-black rounded-sm bg-white p-2"
          ></input>
          <button
            className="ml-12 border border-black rounded-sm bg-indigo-600 text-white w-24 h-8 cursor-pointer "
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
              className="bg-white rounded-md p-4 mt-2"
            >
              <div className="whitespace-pre-wrap">{ansbody}</div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
