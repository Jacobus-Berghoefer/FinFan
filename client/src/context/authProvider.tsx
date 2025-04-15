import { useState, useEffect, ReactNode } from "react";
import { AuthContext, User } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track session loading

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
              avatar: data.user.avatar || null,
              sleeper_id: data.user.sleeper_id || null,
              sleeper_linked: data.user.sleeper_linked || false,
              sleeper_display_name: data.user.sleeper_display_name || null,
            });
          }
        } catch (err) {
          console.error("Session check failed:", err);
        } finally {
          setLoading(false); // ✅ Always stop loading
        }
      };
  
      fetchSession();
    }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};