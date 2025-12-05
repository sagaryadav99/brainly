import { Deleteicon } from "../icons/deleteicon";
import { Notebookicon } from "../icons/notebookicon";
import { Shareicon } from "../icons/shareicone";
import Youtube from "react-youtube-embed";
import { Tweet } from "react-tweet";
import { Tagtile } from "./tagtile";
import { Summarybox } from "./summary";
import { Sumloading } from "./sumloading";
import { NoteText } from "./notetext";

interface cardprops {
  variant: "youtube" | "twitter" | "note";
  id: string;
  title: string;
  link: string;
  tags?: [];
  summary?: string;
  summaryStatus?: string;
  note?: string;
}

export function Card(props: cardprops) {
  return (
    <div className="flex flex-col justify-between bg-white outline outline-gray-200 p-4 rounded-md m-2 w-[325px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Notebookicon />
          {props.title}
        </div>
        <div className="flex items-center gap-2">
          <Shareicon />
          <Deleteicon contentid={props.id} />
        </div>
      </div>
      <div className="mt-2 mb-4">
        {props.variant == "youtube" ? (
          <div className="rounded-xl overflow-hidden h-[200px] youtube-container">
            <Youtube id={props.link} />
          </div>
        ) : props.variant == "note" ? (
          <div className="h-full w-full">
            <NoteText text={props.note ? props.note : ""} />
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              go to link
            </a>
          </div>
        ) : (
          <div className="h-[200px] w-full no-scrollbar overflow-y-auto rounded-xl ">
            <div className="relative -top-5 -mb-8">
              <Tweet id={props.link} />
            </div>
          </div>
        )}
      </div>
      {props.tags?.length != 0 ? (
        <div className="m-2">
          {props.tags?.map((item, index: number) => {
            return <Tagtile key={index} tagcontent={item} />;
          })}
        </div>
      ) : null}
      <div>
        {props.summaryStatus === "pending" ? (
          <Sumloading />
        ) : (
          <Summarybox modified={props.summary} objid={props.id} />
        )}
      </div>
    </div>
  );
}
