import { useState, ReactNode } from "react";
import { AuthContext, User } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: 5,
    display_name: "UserName",
    avatar: "https://example.com/avatar.png",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};