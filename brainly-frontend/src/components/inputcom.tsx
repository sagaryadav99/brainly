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
        className="border rounded p-2 m-[3px] w-full"
        placeholder={props.placeholder}
        ref={props.reference}
      ></input>
    </div>
  );
}
