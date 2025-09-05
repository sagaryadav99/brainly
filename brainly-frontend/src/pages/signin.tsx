import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Inputcomp } from "../components/inputcom";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

export function SignIn() {
  const usernameref = useRef<HTMLInputElement>(null);
  const passwordref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postapi,
    onSuccess: () => {
      navigate("/cards");
    },
  });
  async function postapi() {
    const username = usernameref.current?.value;
    const password = passwordref.current?.value;
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    localStorage.setItem("token", data.token);
    return data;
  }
  function onclickhandler() {
    mutation.mutate();
  }
  return (
    <div className="bg-gray-200 h-screen w-screen fixed flex items-center justify-center">
      <div className="bg-white p-4 border rounded text-center">
        <Inputcomp placeholder="email" reference={usernameref} />
        <Inputcomp placeholder="password" reference={passwordref} />
        <div className="flex justify-center">
          <Button
            text="signin"
            variant="primary"
            size="sm"
            onClick={onclickhandler}
          />
        </div>
        {mutation.isSuccess ? <div>signed in</div> : null}
        {mutation.isPending ? <div>loading...</div> : null}
        {mutation.isError ? (
          <div>{(mutation.error as Error).message}</div>
        ) : null}
      </div>
    </div>
  );
}
