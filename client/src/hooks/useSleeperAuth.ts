import { useContext } from "react";
import { SleeperContext } from "../context/sleeperContext";

export const useSleeperAuth = () => {
  const context = useContext(SleeperContext);
  if (!context) {
    throw new Error("useSleeperAuth must be used within a SleeperProvider");
  }
  return context;
};