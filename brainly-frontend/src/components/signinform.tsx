import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "../icons/loader";
const Schema = z.object({
  // email: z.email(),
  // password: z.string().min(8, "too short").max(16, "too long"),
  email: z.string(),
  password: z.string(),
});
type FormField = z.infer<typeof Schema>;
export function SigninForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FormField> = (data) => {
    mutation.mutate(data);
  };
  const mutation = useMutation({
    mutationFn: (formdata: FormField) => postapi(formdata),
    onSuccess: () => {
      reset();
      navigate("/cards");
    },
  });
  async function postapi(formdata: FormField) {
    const response = await fetch("http://localhost:3000/api/v1/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formdata.email,
        password: formdata.password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError("root", { message: data.message });
      throw new Error(data.message);
    }
    localStorage.setItem("token", data.token);
    return data;
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-white min-h-full w-full flex flex-col gap-8 p-4 rounded-md"
    >
      <div className="flex flex-col gap-2 font-medium">
        Email
        <input
          className="px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-sm focus:ring-3 focus:ring-neutral-600 transition-all "
          {...register("email")}
          type="text"
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 font-medium">
        Password
        <input
          className="px-2 py-1 bg-[#1F1F1F] rounded-sm focus:outline-none ring ring-neutral-600 focus:ring-neutral-600 focus:ring-3 transition-all"
          {...register("password")}
          type="password"
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>
      <button
        className="bg-blue-800 mt-2 font-medium text-neutral-100 text-shadow-md px-8 py-2 rounded-md hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101"
        type="submit"
      >
        {isSubmitting ? <LoaderCircle /> : "Sign in"}
      </button>
      {errors.root && (
        <span className="text-red-500">{errors.root.message}</span>
      )}
    </form>
  );
}
