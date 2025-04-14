import { createContext } from "react";

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar: string | null;
  sleeper_id: string | null;
  sleeper_linked: boolean;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);