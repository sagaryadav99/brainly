//const arr = ["#1c1917", "#404040", "#475569", "#1e1b4b", "#052e16", "#0c4a6e"];
export function Tagtile({
  tagcontent,
  zindex,
}: {
  tagcontent: string;
  zindex: number;
}) {
  return (
    <div
      style={{
        transform: `translateX(-${zindex * 12}px)`,
        zIndex: zindex * 10,
      }}
      className={`bg-zinc-800 text-neutral-400 tracking-tighter rounded-full h-[30px] lg:max-w-[30px] overflow:hidden truncate flex items-center outline-white hover:max-w-[200px] hover:z-999 transition-all ease-in-out duration-400 delay-50 p-2 pr-4 border border-2 border-background cursor-pointer hover:-translate-y-1 hover:scale-103`}
    >
      {tagcontent}
    </div>
  );
}
