import { useState } from "react";
import { SigninForm } from "../components/signinform";
import { SignupForm } from "../components/signupform";
import { BrainIconAnimated } from "../icons/brainIconAnimated";

export function Accounts() {
  const [left, setLeft] = useState(true);
  function slide() {
    setLeft((x) => !x);
  }
  return (
    <div className="bg-background h-screen pt-15 font-sans selection:text-black selection:bg-neutral-400">
      <div
        className={`max-w-[70%] min-h-[75%] border-2 border-neutral-700 shadow-[0px_0px_5px_rgba(0,0,0,1)] mx-auto flex rounded-4xl p-4 relative gap-4 transition-all`}
      >
        <div
          className={`absolute bg-transparent backdrop-blur-2xl drop-shadow-lg drop-shadow-blue-500/15 max-w-[50%] scale-107 inset-0 top-0 left-0 transition-all duration-500 ease-in-out flex flex-col pointer-events-auto z-50 ${
            left
              ? "translate-x-[100%] rounded-br-3xl rounded-tr-3xl rounded-bl-md rounded-md shadow-[10px_10px_35px_rgba(0,0,0,0.5)]"
              : "-translate-x-0 rounded-bl-3xl rounded-tl-3xl rounded-br-md rounded-tr-md shadow-[-10px_10px_35px_rgba(0,0,0,0.5)]"
          }`}
          onClick={slide}
        >
          <div className="flex flex-col gap-4 mt-16">
            <div className="mx-auto">
              <BrainIconAnimated size={"size-30"} />
            </div>
            <div className="transition-all duration-2000 ease-in-out text-center px-8">
              <div className="text-neutral-400 text-md">
                Demo-mode. This is testing environment you can signup and then
                signin using any random(valid) email and password
              </div>
              <div className="text-neutral-300 text-sm mt-8 transition-all duration-500 delay-500">
                {left ? (
                  <div>
                    {`Already have an account? `}
                    <span className="text-blue-500 underline cursor-pointer hover:text-blue-400 ">
                      Sign in
                    </span>
                  </div>
                ) : (
                  <div>
                    {`Don't have an account? `}
                    <span className="text-blue-500 underline cursor-pointer hover:text-blue-400 ">
                      Sign up
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <SignupForm slidefn={slide} />
        <SigninForm />
      </div>
    </div>
  );
}
