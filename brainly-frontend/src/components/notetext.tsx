interface noteText {
  text: string;
}
export function NoteText({ text }: noteText) {
  return (
    <textarea className="w-full h-[200px] border border-2 rounded-md no-scrollbar">
      {text}
    </textarea>
  );
}
