import { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

    // 👇 On app load, check for session cookie
    useEffect(() => {
      const fetchSession = async () => {
        try {
          const res = await fetch("/api/auth/session", {
            credentials: "include", // Required to send the cookie!
          });
          const data = await res.json();
  
          if (res.ok && data.authenticated) {
            setUser({
              id: data.user.id,
              username: data.user.username,
              display_name: data.user.display_name,
              avatar: null, // You can fetch or fill this later
              sleeper_id: null,
              sleeper_linked: false,
            });
          }
        } catch (err) {
          console.error("Session check failed:", err);
        }
      };
  
      fetchSession();
    }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};