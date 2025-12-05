import { ReactElement, useContext } from "react";
import { SidebarContext } from "../contexts/sidebarcontext";
interface sidebaritemprops {
  text: string;
  icon: ReactElement;
  active?: ReactElement;
}
export function SideBarItem(props: sidebaritemprops) {
  const { open } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center justify-center my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        props.active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {props.icon}
      <span
        className={`overflow-hidden transition-all ${
          open ? "w-52 ml-3" : "w-0"
        }`}
      >
        {props.text}
      </span>
      {!open && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {props.text}
        </div>
      )}
    </li>
  );
}
