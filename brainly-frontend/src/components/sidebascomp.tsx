import { ReactElement, useState } from "react";
import { ChevronFirst } from "lucide-react";
import { SidebarContext } from "../contexts/sidebarcontext";
export function Sidebarcom({
  icon,
  title,
  children,
}: {
  icon: ReactElement;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`h-screen transition-all ${open ? "w-52" : "w-12"}`}>
      <nav className="h-full flex flex-col bg-background shadow-xl">
        <div className="pt-4 pb-2 pr-2 flex justify-between items-center">
          <span
            onClick={() => {
              setOpen((x) => !x);
            }}
            className="pl-2 cursor-pointer transition-all"
          >
            {icon}
          </span>
          <div
            className={`overflow-hidden transition-all pl-2 ${
              open ? "w-fit h-fit" : "w-0 h-0"
            }`}
          >
            {title}
          </div>
          <button
            onClick={() => {
              setOpen((x) => !x);
            }}
            className="rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {open ? <ChevronFirst className="cursor-pointer" /> : null}
          </button>
        </div>
        <SidebarContext.Provider value={{ open }}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}
