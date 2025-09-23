import { Deleteicon } from "../icons/deleteicon";
import { Notebookicon } from "../icons/notebookicon";
import { Shareicon } from "../icons/shareicone";
import Youtube from "react-youtube-embed";
import { Tweet } from "react-tweet";
import { Tagtile } from "./tagtile";
import { Summarybox } from "./summary";
import { Suspense } from "react";
import { Sumloading } from "./sumloading";

interface cardprops {
  variant: "youtube" | "twitter";
  id: string;
  title: string;
  link: string;
  tags?: [];
  summary?: string;
}

export function Card(props: cardprops) {
  return (
    <div>
      <div className="bg-white outline outline-gray-200 p-4 rounded-md m-2 w-[325px] ">
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
        <div className="mt-2">
          {props.variant == "youtube" ? (
            <Youtube id={props.link} />
          ) : (
            <Tweet id={props.link} />
          )}
        </div>
        <div className="m-2">
          {props.tags?.map((item, index: number) => {
            return <Tagtile key={index} tagcontent={item} />;
          })}
        </div>
        <Suspense fallback={<Sumloading />}>
          <Summarybox modified={props.summary} objid={props.id} />
        </Suspense>
      </div>
    </div>
  );
}
