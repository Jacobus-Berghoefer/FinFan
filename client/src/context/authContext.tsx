import { createContext, useContext } from "react";

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar: string | null;
  sleeper_id: string | null;
  sleeper_linked: boolean;
  sleeper_display_name: string | null;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);