import { ReactNode, useState } from "react";
import { SleeperContext, SleeperContextType } from "./sleeperContext";

export const SleeperProvider = ({ children }: { children: ReactNode }) => {
  const [sleeperUser] = useState<SleeperContextType>({
    sleeperId: "123",
    displayName: "Subocaj",
    avatar: "https://example.com/avatar.png",
    currentOpponent: "Brobeak",
  });

  return (
    <SleeperContext.Provider value={sleeperUser}>
      {children}
    </SleeperContext.Provider>
  );
};