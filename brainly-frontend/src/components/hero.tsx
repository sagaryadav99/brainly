export function Hero() {
  return (
    <div className="min-h-[dvh] max-w-[95%] mx-auto text-white px-2 py-20 gap-4 text-center flex flex-col gap-4 items-center">
      <div className="text-6xl py-2 font-bold font-hero tracking-tighter text-neutral-200 py-2">
        Your{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-500">
          Knowledge
        </span>
        , Organized Automatically
      </div>
      <div className="text-2xl py-2 font-medium font-hero tracking-tight text-neutral-400">
        Turn any link into instant, smart Knowledge
      </div>
      <div className="text-lg font-normal font-hero text-neutral-500 max-w-[40%] mx-auto">
        Paste a Youtube video, Tweet or Note. We summarize it, store it and
        answer your questions using your own knowledge base-powered by AI.
      </div>
      <div className="font-semibold font-hero mt-4 gap-4 flex">
        <button className="bg-blue-800 text-neutral-200 text-shadow-md px-8 py-2 rounded-lg hover:bg-blue-700 cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101">
          Try MINDRAW
        </button>
        <button className="text-blue-500 ring font-medium ring-blue-700 px-8 py-2 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-700 transition-all hover:scale-101">
          Watch Demo
        </button>
      </div>
    </div>
  );
}
