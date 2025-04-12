import { createContext } from "react";

export interface User {
  id: number;
  display_name: string;
  avatar: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);