import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { CardContext } from "../contexts/CardContext";
interface Deleteprop {
  contentid: string;
}
export function Deleteicon({ contentid }: Deleteprop) {
  const queryclient = useQueryClient();
  const ctx = useContext(CardContext);

  const mutation = useMutation({
    mutationFn: deletepost,
    onSuccess: () => {
      refetching(contentid);
    },
  });
  function onclickhandler() {
    if (ctx) {
      ctx.setOpen(false);
    }
    mutation.mutate();
  }
  async function deletepost() {
    const token = localStorage.getItem("token");
    const response = await fetch("http://192.168.1.8:3000/api/v1/content", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token ? token : "",
      },
      body: JSON.stringify({ contentid: contentid }),
    });
    return response.json();
  }
  async function refetching(contentid: string) {
    queryclient.setQueryData(["cards"], (currelement: any) => {
      return currelement?.filter(
        (posts: { _id: string }) => posts._id != contentid
      );
    });
  }
  return (
    <div
      className="cursor-pointer hover:scale-105 transition-all ease-in-out hover:text-neutral-200"
      onClick={(e) => {
        e.stopPropagation();
        onclickhandler();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>
  );
}
