import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderCircle } from "../icons/loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const API = import.meta.env.VITE_BASE_URL;
const Schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "minimum 8 characters")
    .max(16, "maximum 16 characters"),
  fname: z
    .string()
    .trim()
    .min(4, "minimum 4 characters")
    .max(16, "maximum 16 characters"),
});
type FormField = z.infer<typeof Schema>;
export function SignupForm({ slidefn }: { slidefn: () => void }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    resolver: zodResolver(Schema),
    defaultValues: {
      fname: "",
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FormField> = (data: FormField) => {
    mutation.mutate(data);
  };
  const mutation = useMutation({
    mutationFn: (data: FormField) => postapi(data),
    onSuccess: () => {
      slidefn();
      reset();
    },
  });
  async function postapi(data: FormField) {
    const response = await fetch(API + "/api/v1/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fname: data.fname,
        username: data.email,
        password: data.password,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      setError("root", { message: error.message });
      throw new Error("failed to add you as a user");
    }
    return response.json();
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="text-white min-h-full w-full flex flex-col gap-4 p-4 rounded-md"
    >
      <div className="flex flex-col gap-2 font-medium">
        Name
        <input
          className="px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-md focus:ring-3 focus:ring-neutral-600 transition-all "
          {...register("fname")}
          type="text"
        ></input>
        {errors.fname && (
          <span className="text-red-500">{errors.fname.message}</span>
        )}
      </div>
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
          className="px-2 py-1 bg-[#1F1F1F] focus:outline-none ring ring-neutral-600 rounded-sm focus:ring-3 focus:ring-neutral-600 transition-all "
          {...register("password")}
          type="password"
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>
      <button
        className="bg-blue-800 mt-2 font-medium text-neutral-100 text-shadow-md px-8 py-2 rounded-sm hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101"
        type="submit"
      >
        {isSubmitting ? <LoaderCircle /> : "Sign up"}
      </button>
      {errors.root && (
        <span className="text-red-500">{errors.root.message}</span>
      )}
    </form>
  );
}
