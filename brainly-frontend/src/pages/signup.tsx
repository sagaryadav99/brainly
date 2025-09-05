import { Button } from "../components/Button";
import { Inputcomp } from "../components/inputcom";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const emailref = useRef<HTMLInputElement>(null);
  const passwordref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  function onclickhandler() {
    mutation.mutate();
  }
  const mutation = useMutation({
    mutationFn: postapi,
    onSuccess: () => {
      navigate("/signin");
    },
  });
  async function postapi() {
    const username = emailref.current?.value;
    const password = passwordref.current?.value;
    console.log(JSON.stringify({ username: username, password: password }));
    const response = await fetch("http://localhost:3000/api/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
    if (!response.ok) {
      throw new Error("failed to add you as a user");
      return;
    }
    return response.json();
  }
  return (
    <div className="bg-gray-200 h-screen w-screen fixed flex items-center justify-center">
      <div className="bg-white p-4 border rounded text-center">
        <Inputcomp placeholder="email" reference={emailref} />
        <Inputcomp placeholder="password" reference={passwordref} />
        <div className="flex justify-center">
          <Button
            text="signup"
            variant="primary"
            size="sm"
            onClick={onclickhandler}
          />
        </div>

        {mutation.isPending ? <div>adding user</div> : null}
        {mutation.isError ? <div>{mutation.error.message}</div> : null}
        {mutation.isSuccess ? <div>added successfully please login</div> : null}
      </div>
    </div>
  );
}
