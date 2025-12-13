import { useEffect, useState } from "react";
import { BrainIcon } from "../icons/brainIcon";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const [top, setTop] = useState(true);
  const navigate = useNavigate();
  useEffect(function () {
    function handleScroll() {
      setTop(window.scrollY === 0);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  function accountHandler() {
    navigate("/account");
  }
  return (
    <div
      className={`absolute sticky w-full bg-transparent backdrop-blur-2xl drop-shadow-sm drop-shadow-blue-500/10 top-0 p-4 flex font-hero font-bold justify-between transition-h duration-200 border-slate-800 ${
        top
          ? "h-[90px] border-b-0"
          : "h-[60px] border-b shadow-[10px_10px_35px_rgba(0,0,0,0.5)]"
      }`}
    >
      <div className="text-neutral-200 flex justify-center gap-4 items-center">
        <BrainIcon size="size-11" />
        <div>
          <h5 className="text-2xl">MINDRAW</h5>
        </div>
      </div>
      <div className="text-neutral-500 flex justify-center gap-5 items-center">
        <button className="cursor-Lpointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150">
          Overview
        </button>
        <button className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150">
          Login/Signup
        </button>
        <button className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150">
          Demo
        </button>
        <button
          className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150"
          onClick={accountHandler}
        >
          Account
        </button>
      </div>
    </div>
  );
}
