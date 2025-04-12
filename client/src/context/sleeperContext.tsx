import { createContext } from "react";

export interface SleeperContextType {
  sleeperId: string;
  displayName: string;
  avatar: string;
  currentOpponent?: string;
}

export const SleeperContext = createContext<SleeperContextType | undefined>(undefined);