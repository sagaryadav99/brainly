type Block =
  | { type: "Heading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "bullet"; content: string[] };

export function aiparser(aitext: string) {
  console.log(aitext);
  const trimmed = normalizeText(aitext).split("\n");
  const blocks: Block[] = [];
  let currentList: string[] = [];
  trimmed.forEach((item) => {
    if (item === "") {
      return;
    }
    if (item.startsWith("**")) {
      item = item.replaceAll("**", "");
      blocks.push({ type: "Heading", content: item });
      return;
    }
    if (item.startsWith("* ") || item.startsWith("  + ")) {
      item = item.replaceAll("* ", "");
      item = item.replaceAll("  + ", "");
      currentList.push(item);
      return;
    }
    if (currentList.length != 0) {
      blocks.push({ type: "bullet", content: currentList });
      currentList = [];
    }
    blocks.push({ type: "paragraph", content: item });
  });
  return blocks;
}
function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").trim();
}
