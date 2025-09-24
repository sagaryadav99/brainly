/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Closeicon } from "../icons/closeicon";
import { Button } from "./Button";
import { Inputcomp } from "./inputcom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tagcomp } from "./tagcomponent";

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
  //const [tags,settags]=useState({tagarr:[]});
  const [tags, setTags] = useState<{ tagarr: string[] }>({ tagarr: [] });
  const token = localStorage.getItem("token");
  const [content, setContent] = useState("youtube");
  const { data } = useQuery({ queryKey: ["tags"], queryFn: gettags });
  const mutation1 = useMutation({
    mutationFn: postapi,
    onSuccess: () => {
      refetch();
      onClose();
      setTags({ tagarr: [] });
    },
  });
  async function postapi() {
    const title = titleref.current?.value;
    const link = linkref.current?.value;
    const contenttype = content;
    const response = await fetch("http://localhost:3000/api/v1/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ title, link, contenttype, tags }),
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
    const resp = await fetch("http://localhost:3000/api/v1/tagname", {
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
    const resp = await fetch("http://localhost:3000/api/v1/tagname", {
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
      {open && (
        <div className="flex items-center justify-center">
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-gray-200 opacity-50 backdrop-blur-sm "
            onClick={onClose}
          ></div>
          <span className="bg-white fixed p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded">
            <span className="flex justify-end mb-2">
              <Closeicon onClose={onClose} />
            </span>
            <Inputcomp placeholder="Title" reference={titleref} />
            <Inputcomp placeholder="Link" reference={linkref} />
            <div>please select link type:</div>
            <div className="flex items-center justify-around m-2">
              <Button
                variant={`${content == "youtube" ? "primary" : "secondary"}`}
                size="sm"
                text="youtube"
                onClick={() => {
                  setContent("youtube");
                }}
              />
              <Button
                variant={`${content == "twitter" ? "primary" : "secondary"}`}
                size="sm"
                text="twitter"
                onClick={() => {
                  setContent("twitter");
                }}
              />
            </div>
            <div className="bg-gray-200 text-center">
              <div className="flex">
                Tags:
                <Inputcomp placeholder="add a tag" reference={tagref} />
                <button
                  onClick={addtaghandler}
                  className="bg-blue-300 p-2 rounded hover:bg-blue-500"
                >
                  create new tag
                </button>
              </div>
              <div>
                {tags.tagarr.map((item) => {
                  return item;
                })}
              </div>
              <div className="bg-gray border flex items-center">
                {data?.map((item: any) => {
                  return <Tagcomp content={item.tagname} addtag={addtag} />;
                })}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                text="Add"
                onClick={addcontent}
              />
            </div>
            <div className="text-center">
              {mutation1.isError ? (mutation1.error as Error).message : null}
            </div>
          </span>
        </div>
      )}
    </div>
  );
}
