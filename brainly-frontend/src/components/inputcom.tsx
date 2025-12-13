import { RefObject } from "react";

// eslint-disable @typescript-eslint/no-explicit-any
interface inputcomp {
  placeholder: string;
  //reference?: any;
  reference: RefObject<HTMLInputElement>;
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
