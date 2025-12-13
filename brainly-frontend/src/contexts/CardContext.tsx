import { createContext } from "react";
export interface CardContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const CardContext = createContext<CardContextType | null>(null);
