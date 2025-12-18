import { useState } from "react";

export function Tagcomp({
  content,
  addtag,
}: {
  content: string;
  addtag: (a: string) => void;
}) {
  const [select, setSelect] = useState(false);
  return (
    <span
      className={`p-1 border rounded m-1 cursor-pointer border-neutral-700 transiton-all duration-200 text-neutral-300 ${
        select
          ? "bg-neutral-600 text-white"
          : "bg-zinc-800 hover:bg-neutral-700 hover:-translate-y-0.5"
      }`}
      onClick={() => {
        setSelect(!select);
        addtag(content);
      }}
    >
      {content}
    </span>
  );
}
