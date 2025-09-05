import { ReactElement } from "react";
interface sidebaritemprops {
  text: string;
  icon: ReactElement;
}
export function SideBarItem(props: sidebaritemprops) {
  return (
    <div className="flex gap-2 items-center ml-2 mr-2 mt-2 rounded-sm pl-2 hover:bg-gray-200 cursor-pointer">
      {props.icon}
      {props.text}
    </div>
  );
}
