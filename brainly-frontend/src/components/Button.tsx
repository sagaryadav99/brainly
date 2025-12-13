import { ReactElement } from "react";

interface Buttonprops {
  variant: "primary" | "secondary";
  size: "md" | "sm";
  onClick?: () => void;
  disabled?: boolean;
  starticon?: ReactElement;
  text?: string | ReactElement;
  children?: React.ReactNode;
}

const variantstyle = {
  primary:
    "bg-blue-800 text-neutral-200 text-shadow-md hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101",
  secondary:
    "text-blue-500 ring font-medium ring-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101",
};

const sizestyle = {
  sm: "px-10 py-2 rounded-md",
  md: "px-10 py-4 rounded-md",
};

const defaultstyle = "flex items-center justify-center cursor-pointer";

export function Button(props: Buttonprops) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${defaultstyle} ${sizestyle[props.size]} ${
        variantstyle[props.variant]
      }`}
    >
      <div className="flex items-center gap-2 justify-center">
        {props.starticon}
        {props.children ?? props.text}
      </div>
    </button>
  );
}
