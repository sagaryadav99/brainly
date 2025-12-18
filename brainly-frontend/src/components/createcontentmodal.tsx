/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Closeicon } from "../icons/closeicon";
import { Button } from "./Button";
import { Inputcomp } from "./inputcom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tagcomp } from "./tagcomponent";
import { LoaderCircle } from "../icons/loader";
import { AnimatePresence, motion } from "motion/react";

interface modalprops {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  reference?: React.RefObject<HTMLElement>;
}

export function Createcontenmodal({ open, onClose, refetch }: modalprops) {
  const queryClient = useQueryClient();
  const titleref = useRef<HTMLInputElement>(null);
  const linkref = useRef<HTMLInputElement>(null);
  const tagref = useRef<HTMLInputElement>(null);
  const noteref = useRef<HTMLTextAreaElement>(null);
  //const [tags,settags]=useState({tagarr:[]});
  const [tags, setTags] = useState<{ tagarr: string[] }>({ tagarr: [] });
  const token = localStorage.getItem("token");
  const [content, setContent] = useState("youtube");
  const { data } = useQuery({ queryKey: ["tags"], queryFn: gettags });
  const mutation1 = useMutation({
    mutationFn: postapi,
    onSuccess: () => {
      onClose();
      refetch();
      setTags({ tagarr: [] });
    },
  });
  async function postapi() {
    const title = titleref.current?.value;
    const link = linkref.current?.value;
    let note = noteref.current?.value;
    const contenttype = content;
    if (contenttype !== "note") {
      note = "";
    }
    const response = await fetch("http://192.168.1.8:3000/api/v1/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ title, link, contenttype, tags, note }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  }
  function addcontent() {
    mutation1.mutate();
  }

  const mutation2 = useMutation({
    mutationFn: addtags,
    onSuccess: refetching,
  });
  async function refetching() {
    if (tagref.current) {
      tagref.current.value = "";
    }
    await queryClient.invalidateQueries({ queryKey: ["tags"] });
    await queryClient.refetchQueries({ queryKey: ["tags"] });
  }
  async function addtags() {
    const tag = tagref.current?.value;
    if (tag === "" || tag === " ") {
      alert("empty tag");
      return;
    }
    const resp = await fetch("http://192.168.1.8:3000/api/v1/tagname", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ tagname: tag }),
    });
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
      console.log(newarr);
      setTags({ tagarr: newarr });
    } else {
      const newarr = [...tags.tagarr, tgcontent];
      setTags({ tagarr: newarr });
    }
  }
  async function gettags() {
    const resp = await fetch("http://192.168.1.8:3000/api/v1/tagname", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
    });
    return resp.json();
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
            <div className="bg-background text-neutral-300 fixed p-4 rounded-xl absolute top-5 w-[95%] md:w-2xl h-[525px] flex flex-col gap-2 shadow-[10px_10px_35px_rgba(0,0,0,1)] justify-around">
              <div className="flex items-center">
                <div className="flex-1 text-center font-bold text-xl">
                  Paste your link here and let us summarize
                </div>
                <div>
                  <Closeicon onClose={onClose} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 no-scrollbar mask-background mask-b-from-background mask-b-from-95% mask-b-to-transparent mask-t-from-background mask-t-from-97% mask-t-to-transparent">
                <Inputcomp placeholder="Title" reference={titleref} />
                <Inputcomp placeholder="Link" reference={linkref} />
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
                    />
                    <Button
                      key="note"
                      variant={`${content == "note" ? "primary" : "secondary"}`}
                      size="sm"
                      text="Note"
                      onClick={() => {
                        setContent("note");
                      }}
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
                    {data?.map((item: any) => {
                      return <Tagcomp content={item.tagname} addtag={addtag} />;
                    })}
                  </div>
                </div>
                {content == "note" ? (
                  <textarea
                    placeholder="add a note"
                    className="w-full h-[100px] px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all shrink-0"
                    ref={noteref}
                  />
                ) : null}
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={mutation1.isPending}
                    onClick={addcontent}
                  >
                    {mutation1.isPending ? (
                      <span className="flex items-center gap-2">
                        Adding
                        <LoaderCircle />
                      </span>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
                <div className="text-center">
                  {mutation1.isError
                    ? (mutation1.error as Error).message
                    : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
