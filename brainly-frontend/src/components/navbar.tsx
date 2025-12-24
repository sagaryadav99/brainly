import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../icons/hamburger";
import { BrainIcon } from "../icons/brainIcon";
export function Navbar() {
  const [top, setTop] = useState(true);
  const [open, setOpen] = useState(false);
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
  function openmenu() {
    setOpen((x) => !x);
  }
  function scrolltotop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <div
      className={`absolute sticky max-w-dvw md:w-full bg-transparent backdrop-blur-2xl top-0 p-4 flex items-center font-hero font-bold justify-between transition-h duration-200 border-slate-800 relative ${
        top
          ? "h-[90px] border-b-0"
          : "h-[60px] border-b shadow-[10px_10px_35px_rgba(0,0,0,0.5)] drop-shadow-sm drop-shadow-blue-500/10"
      }`}
    >
      <div className="text-neutral-200 flex justify-center gap-4 items-center">
        <BrainIcon size="size-8 md:size-11" />
        <div>
          <h5 className="text-base md:text-2xl">MINDRAW</h5>
        </div>
      </div>
      <div className="text-neutral-500 flex justify-center gap-5 items-center hidden md:inline">
        <button
          className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150"
          onClick={scrolltotop}
        >
          Overview
        </button>
        <button
          className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150"
          onClick={accountHandler}
        >
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
      <div className="md:hidden">
        <div onClick={openmenu}>
          <HamburgerMenu />
        </div>
        {open && (
          <div className="text-neutral-500 flex absolute top-15 right-0 left-0 w-full bg-background backdrop-blur-2xl flex-col justify-center gap-5 items-center md:hidden">
            <button
              className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150"
              onClick={scrolltotop}
            >
              Overview
            </button>
            <button
              className="cursor-pointer hover:bg-[#262626] hover:text-white px-4 py-2 rounded-lg transition-all duration-150"
              onClick={accountHandler}
            >
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
        )}
      </div>
    </div>
  );
}
