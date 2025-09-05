import { ReactElement } from "react";

interface Buttonprops {
  variant: "primary" | "secondary";
  size: "md" | "sm";
  onClick?: () => void;
  text: string;
  starticon?: ReactElement;
}
const variantstyle = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-500",
};
const sizestyle = {
  sm: "px-10 py-2 rounded-md ",
  md: "px-10 py-4 rounded-md ",
};
const defaultstyle = "flex items-center justify-center cursor-pointer ml-4";

export function Button(props: Buttonprops) {
  return (
    <button
      onClick={props.onClick}
      className={`${defaultstyle} ${sizestyle[props.size]} ${
        variantstyle[props.variant]
      }`}
    >
      {" "}
      <div className="flex items-center gap-2 justify-center">
        {props.starticon}
        {props.text}
      </div>
    </button>
  );
}
