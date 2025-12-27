import { useRef, useState } from "react";
import { Closeicon } from "../icons/closeicon";
import { Button } from "./Button";
import { Inputcomp } from "./inputcom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tagcomp } from "./tagcomponent";
import { LoaderCircle } from "../icons/loader";
import { AnimatePresence, motion } from "motion/react";
import { gettags } from "../utils/fetchfunctions";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const API = import.meta.env.VITE_BASE_URL;
interface Tag {
  authorid: string;
  _id: string;
  tagname: string;
}
interface modalprops {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  reference?: React.RefObject<HTMLElement>;
}
const schema = z.object({
  title: z
    .string()
    .max(80, "too long, 80 characters max")
    .min(5, "min 5 characters"),
  link: z.url("invalid link"),
  note: z
    .string()
    .min(20, "too short, min 20 characters")
    .max(1500, "1500 characters max")
    .optional(),
});
type FormField = z.infer<typeof schema>;
export function Createcontenmodal({ open, onClose, refetch }: modalprops) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();
  const tagref = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<{ tagarr: string[] }>({ tagarr: [] });
  const token = localStorage.getItem("token");
  const [content, setContent] = useState("youtube");
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => gettags(token),
    retry: false,
    enabled: !!token,
  });
  const mutation1 = useMutation({
    mutationFn: (data: FormField) => postapi(data),
    onSuccess: () => {
      onClose();
      refetch();
      reset();
      setTags({ tagarr: [] });
    },
    retry: false,
  });
  async function postapi(formdata: FormField) {
    const title = formdata.title;
    const link = formdata.link;
    let note = formdata.note;
    const contenttype = content;
    if (contenttype !== "note") {
      note = "";
    }
    const response = await fetch(API + "/api/v1/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ title, link, contenttype, tags, note }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(data);
      throw new Error(data.message || data.error);
    }
    return data;
  }
  const onSubmit: SubmitHandler<FormField> = (data) => {
    mutation1.mutate(data);
  };

  const mutation2 = useMutation({
    mutationFn: addtags,
    onSuccess: refetching,
    retry: false,
  });
  async function refetching() {
    if (tagref.current) {
      tagref.current.value = "";
    }
    await queryClient.invalidateQueries({ queryKey: ["tags"] });
    // await queryClient.refetchQueries({ queryKey: ["tags"] });
  }
  async function addtags() {
    const tag = tagref.current?.value;
    if (tag === "" || tag === " ") {
      alert("empty tag");
      return;
    }
    const resp = await fetch(API + "/api/v1/tagname", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ tagname: tag }),
    });
    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.message || "failed to fetch");
    }
    return resp.json();
  }
  function addtaghandler() {
    mutation2.mutate();
  }
  function addtag(tgcontent: string) {
    if (tags.tagarr.includes(tgcontent)) {
      const newarr = tags.tagarr.filter((x) => {
        return x != tgcontent;
      });
      setTags({ tagarr: newarr });
    } else {
      const newarr = [...tags.tagarr, tgcontent];
      setTags({ tagarr: newarr });
    }
  }
  function onchangehandler(e: React.ChangeEvent<HTMLInputElement>) {
    const link = e.target.value;
    if (link.search("youtu.be") !== -1 || link.search("youtube") !== -1) {
      setContent("youtube");
      return;
    }
    if (link.search("x.com") !== -1) {
      setContent("twitter");
      return;
    }
    setContent("note");
  }
  return (
    <div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex items-center justify-center h-full w-full"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
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
            <motion.div
              className="fixed inset-0 drop-shadow-blue-500/20"
              onClick={onClose}
              initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
              animate={{ backdropFilter: "blur(7px)", opacity: 1 }}
              exit={{
                backdropFilter: "blur(0px)",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            ></motion.div>
            <form
              className="bg-background text-neutral-300 fixed p-4 rounded-xl absolute top-5 w-[95%] md:w-2xl h-[525px] flex flex-col gap-2 shadow-[10px_10px_35px_rgba(0,0,0,1)] justify-around"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex items-center">
                <div className="flex-1 text-center font-bold text-xl">
                  Paste your link here and let us summarize
                </div>
                <div>
                  <Closeicon onClose={onClose} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 no-scrollbar mask-background mask-b-from-background mask-b-from-95% mask-b-to-transparent mask-t-from-background mask-t-from-97% mask-t-to-transparent">
                <input
                  {...register("title")}
                  placeholder="Title"
                  className="w-full px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all"
                />
                {errors.title && (
                  <div className="text-red-500">{errors.title.message}</div>
                )}
                <input
                  {...register("link")}
                  placeholder="Paste a link (Youtube, Twitter, or any website)"
                  className="w-full px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all"
                  onChange={onchangehandler}
                />
                {errors.link && (
                  <div className="text-red-500">{errors.link.message}</div>
                )}
                <div className="flex items-center justify-center m-2 gap-4">
                  <div className="font-bold">Select link type:</div>
                  <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                    <Button
                      key="youtube"
                      variant={`${
                        content == "youtube" ? "primary" : "secondary"
                      }`}
                      size="sm"
                      text="youtube"
                      onClick={() => {
                        setContent("youtube");
                      }}
                      type="button"
                    />
                    <Button
                      key="twitter"
                      variant={`${
                        content == "twitter" ? "primary" : "secondary"
                      }`}
                      size="sm"
                      text="twitter"
                      onClick={() => {
                        setContent("twitter");
                      }}
                      type="button"
                    />
                    <Button
                      key="note"
                      variant={`${content == "note" ? "primary" : "secondary"}`}
                      size="sm"
                      text="Note"
                      onClick={() => {
                        setContent("note");
                      }}
                      type="button"
                    />
                  </div>
                </div>
                <div className="bg-background text-neutral-200 text-center flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-4 font-semibold">
                    Tags:
                    <Inputcomp placeholder="add a tag" reference={tagref} />
                    <button
                      onClick={addtaghandler}
                      className="bg-blue-800 p-1 tracking-tighter md:tracking-tight md:p-2 rounded hover:bg-blue-700 cursor-pointer"
                      type="button"
                    >
                      create new tag
                    </button>
                  </div>
                  <div className="flex gap-2 items-center bg-[#1F1F1F] rounded-md ring ring-neutral-600 px-4 py-2">
                    <div className="pb-3 font-semibold">Selected Tags:</div>
                    <div className="flex items-center gap-2 flex-1 w-auto flex-wrap">
                      {tags.tagarr.map((item) => {
                        return (
                          <div className="bg-zinc-800 text-neutral-200 tracking-tighter rounded-lg h-[30px] max-w-auto border border-2 border-background flex items-center p-2">
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center px-4 py-2 font-semibold rounded-md focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all flex-wrap">
                    Available Tags:
                    {data?.map((item: Tag, idx: number) => {
                      return (
                        <Tagcomp
                          key={idx + item.tagname}
                          content={item.tagname}
                          addtag={addtag}
                        />
                      );
                    })}
                  </div>
                </div>
                {content == "note" ? (
                  <div>
                    <textarea
                      {...register("note")}
                      placeholder="add a note"
                      className="w-full h-[100px] px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all shrink-0 no-scrollbar"
                    />
                    {errors.note && (
                      <div className="text-red-500">{errors.note.message}</div>
                    )}
                  </div>
                ) : null}
                <div className="flex justify-center">
                  <button
                    className="bg-blue-800 text-neutral-200 font-semibold text-base tracking-tight md:tracking-wide text-shadow-md hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101 px-6 py-1 md:px-10 md:py-2 rounded-md"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {mutation1.isPending ? (
                      <span className="flex items-center gap-2">
                        Adding
                        <LoaderCircle />
                      </span>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
                <div className="text-center text-red-500">
                  {mutation1.isError ? mutation1.error.message : null}
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
