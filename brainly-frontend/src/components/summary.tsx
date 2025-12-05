import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export function Summarybox({
  modified,
  objid,
}: {
  modified?: string;
  objid: string;
}) {
  const queryclient = useQueryClient();
  const [focus, setFocus] = useState(false);
  const [sum, setSum] = useState(modified);
  async function updateSum(id: string) {
    const token = localStorage.getItem("token");
    const resp = await fetch(
      "http://localhost:3000/api/v1/content/updatesummary",
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
    <div>
      <textarea
        className="w-full h-24 no-scrollbar"
        value={sum}
        onChange={onchangehandler}
        onFocus={() => {
          setFocus(true);
        }}
      ></textarea>
      {focus ? (
        <button
          id={objid}
          onClick={onclickhandler}
          className="bg-gray-200 rounded border hover:cursor-pointer p-1"
        >
          save this summary
        </button>
      ) : null}
    </div>
  );
}
