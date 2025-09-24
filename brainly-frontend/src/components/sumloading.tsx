import { useEffect, useRef, useState } from "react";

export function Sumloading() {
  const [index, setIndex] = useState(0);
  const textarr = useRef([
    "getting transcripts",
    "generating summary",
    "fine tuning summary",
    "almost done",
  ]);
  useEffect(() => {
    if (index < textarr.current.length - 1) {
      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, (textarr.current.length - index) * 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [index]);
  return (
    <div className="w-full h-24 border border-gray-200 rounded-lg shadow-2xl hover:shadow-black/50 transition-all duration-300 animate-pulse flex items-center justify-center">
      {textarr.current[index]}
    </div>
  );
}
