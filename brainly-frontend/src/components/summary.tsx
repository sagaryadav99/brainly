import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export function Summarybox({
  modified,
  objid,
  hidden,
}: {
  modified?: string;
  objid: string;
  hidden: boolean;
}) {
  const queryclient = useQueryClient();
  const [focus, setFocus] = useState(false);
  const [sum, setSum] = useState(modified);
  async function updateSum(id: string) {
    const token = localStorage.getItem("token");
    const resp = await fetch(
      "http://192.168.1.8:3000/api/v1/content/updatesummary",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: token ? token : "",
        },
        body: JSON.stringify({ id: id, summary: sum }),
      }
    );
    const response = await resp.json();
    return response;
  }
  const sumMutate = useMutation({
    mutationFn: updateSum,
    onSuccess: refetching,
  });
  function onclickhandler(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.currentTarget.id;
    sumMutate.mutate(target);
  }

  function onchangehandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSum(e.target.value);
  }
  async function refetching() {
    await queryclient.invalidateQueries({ queryKey: ["cards"] });
    await queryclient.refetchQueries({ queryKey: ["cards"] });
    setFocus(false);
  }
  return (
    <div className="bg-zinc-1000 p-1 rounded-md text-neutral-300">
      <textarea
        className="w-full h-24 no-scrollbar"
        value={sum}
        disabled={hidden}
        onChange={onchangehandler}
        onFocus={() => {
          setFocus(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      ></textarea>
      {focus ? (
        <button
          id={objid}
          onClick={onclickhandler}
          className="text-blue-500 ring font-medium ring-blue-700 rounded border hover:cursor-pointer p-1"
        >
          save this summary
        </button>
      ) : null}
    </div>
  );
}
