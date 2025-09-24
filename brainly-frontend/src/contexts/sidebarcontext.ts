import { createContext } from "react";

export type SidebarContextType = { open: boolean };

export const SidebarContext = createContext<SidebarContextType>({
  open: false,
});
