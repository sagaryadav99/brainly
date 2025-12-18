interface noteText {
  text: string;
}
export function NoteText({ text }: noteText) {
  return (
    <textarea
      className="w-full h-full text-neutral-200 tracking-tight bg-zinc-950 p-2 rounded-md no-scrollbar resize-none cursor-pointer outline-none border border-2 border-black focus:ring focus:ring-neutral-500"
      readOnly
    >
      {text}
    </textarea>
  );
}
