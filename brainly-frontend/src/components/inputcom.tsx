import { RefObject } from "react";
interface inputcomp {
  placeholder: string;
  reference: RefObject<HTMLInputElement | null>;
}
export function Inputcomp(props: inputcomp) {
  return (
    <div>
      <input
        className="w-full px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all "
        placeholder={props.placeholder}
        ref={props.reference}
      ></input>
    </div>
  );
}
