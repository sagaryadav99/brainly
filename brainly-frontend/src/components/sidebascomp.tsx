import { ReactElement, useState } from "react";
import { Twittericon } from "../icons/twitterIcon";
import { YoutubeIcon } from "../icons/youtubeIcon";
import { SideBarItem } from "./sidebaritem";
import { BrainIcon } from "../icons/brainIcon";

export function Sidebarcom({
  icon,
  title,
}: {
  icon: ReactElement;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => {
        setOpen((x) => !x);
      }}
      onBlur={() => {
        setOpen((x) => !x);
      }}
      className={
        "bg-white fixed outline top-0 left-0 h-screen transition delay-150 duration-150 ease-in-out" +
        `${open ? "w-56" : "w-8"}`
      }
    >
      {open ? (
        <div>
          <div className="m-2 text-lg flex gap-2">
            {icon}
            {title}
          </div>
          <SideBarItem text="twitter" icon={<Twittericon />} />
          <SideBarItem text="youtube" icon={<YoutubeIcon />} />
        </div>
      ) : (
        <div>
          <div className="m-2 ">{<BrainIcon size={"size-6"} />}</div>
          <div className="m-2">{<Twittericon />}</div>
          <div className="m-2">{<YoutubeIcon />}</div>
        </div>
      )}
    </div>
  );
}
