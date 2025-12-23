import { ReactElement } from "react";

interface Buttonprops {
  variant: "primary" | "secondary";
  size: "md" | "sm";
  onClick?: () => void;
  disabled?: boolean;
  starticon?: ReactElement;
  text?: string | ReactElement;
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
}

const variantstyle = {
  primary:
    "bg-blue-800 text-neutral-200 font-semibold text-base tracking-tight md:tracking-wide text-shadow-md hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101",
  secondary:
    "text-blue-500 ring font-semibold ring-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101",
};

const sizestyle = {
  sm: "px-6 py-1 md:px-10 md:py-2 rounded-md",
  md: "px-6 py-1 md:px-10 md:py-4 rounded-md",
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
      type={props.type}
    >
      <div className="flex items-center gap-1 md:gap-2 justify-center">
        {props.starticon}
        {props.children ?? props.text}
      </div>
    </button>
  );
}
