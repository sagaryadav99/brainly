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
      className={`p-1 border rounded m-1 cursor-pointer ${
        select ? "bg-blue-800" : "bg-background hover:bg-blue-600"
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
