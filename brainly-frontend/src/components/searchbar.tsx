import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Smallcard } from "./smallcard";
import { AnimatePresence, motion } from "motion/react";
import { FilterArr } from "../types/filterArrType";
import { BrainIconAnimated } from "../icons/brainIconAnimated";
import { LoaderCircle } from "../icons/loader";
import { TextComp } from "./textcomp";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
const API = import.meta.env.VITE_BASE_URL;
interface searchbar {
  placeholder: string;
  hidden: boolean;
  cards?: FilterArr[];
}
const Schema = z.object({
  question: z.string().max(100, "too long of a question"),
});
type FormField = z.infer<typeof Schema>;
export function Searchbar(props: searchbar) {
  const navigate = useNavigate();
  const [ans, setAns] = useState(false);
  const [ansbody, setAnsbody] = useState("");
  const [filterarr, setFilterarr] = useState<FilterArr[]>();
  const data = props.cards;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormField>({
    resolver: zodResolver(Schema),
  });
  const mutation = useMutation({
    mutationFn: (formdata: FormField) => searchfunc(formdata),
    onSuccess: (answer) => {
      setAns(true);
      setAnsbody(answer.reply);
      const finalArr: FilterArr[] = [];
      answer.filtered.forEach(function (item: string) {
        data?.forEach(function (element: FilterArr) {
          if (element._id == item) {
            finalArr.push(element);
          }
        });
      });
      setFilterarr(finalArr);
    },
  });
  async function searchfunc(formdata: FormField) {
    const token = localStorage.getItem("token");
    const inputrefs = formdata.question;
    const response = await fetch(API + "/api/v1/content/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? token : "",
      },
      body: JSON.stringify({ queryquestion: inputrefs }),
    });
    if (!response.ok) {
      const error = await response.json();
      setError("root", { message: error.error });
      throw new Error("too many requests");
    }
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
  const onSubmit: SubmitHandler<FormField> = (formdata) => {
    if (props.hidden) {
      navigate("/account");
    }
    mutation.mutate(formdata);
  };
  return (
    <div>
      <div className="w-full mt-4 mx-auto px-1 md:px-2 lg:px-4 py-2 md:py-4 lg:py-6 rounded-xl bg-zinc-900 text-neutral-300 border-2 border-black">
        <form
          className="flex items-center justify-center gap-2 md:gap-4 lg:gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <BrainIconAnimated size="size-8 lg:size-10" />
          <div className="flex-grow">
            <div>
              <input
                {...register("question")}
                placeholder={props.placeholder}
                className="w-full px-1 py-1 lg:px-2 lg:py-2 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all"
              ></input>
            </div>
            {errors.question && (
              <div className="text-red-500">{errors.question.message}</div>
            )}
            {errors.root && (
              <div className="text-red-500">{errors.root.message}</div>
            )}
          </div>
          <button
            className="w-[160px] md:w-[200px] lg:w-[220px] bg-blue-800 text-neutral-300 text-shadow-md text-small md:text-base tracking-tight md:tracking-wide font-bold px-2 md:px-4 lg:px-8 py-1 md:py-2 rounded-md md:rounded-lg hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101"
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
                {filterarr?.map((item: FilterArr) => {
                  return (
                    <motion.div variants={childVariant}>
                      <Smallcard
                        link={item.link}
                        title={item.title}
                        key={item._id}
                        contenttype={item.contenttype}
                        note={item.note!}
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
