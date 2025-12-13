interface noteText {
  text: string;
}
export function NoteText({ text }: noteText) {
  return (
    <textarea className="w-full h-full text-neutral-200 tracking-tight bg-zinc-950 p-2 rounded-md no-scrollbar">
      {text}
    </textarea>
  );
}
