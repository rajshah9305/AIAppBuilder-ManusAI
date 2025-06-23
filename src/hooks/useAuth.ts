import { useState, useEffect } from "react";
import { isAuthenticated, getStoredToken, removeStoredToken, storeToken } from "../lib/auth";
import { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token && isAuthenticated(token)) {
      // In a real app, decode JWT to get user info
      setUser({ 
        id: "1", 
        name: "AI Builder User", 
        email: "user@aiappbuilder.com",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string, userData?: User) => {
    if (isAuthenticated(token)) {
      storeToken(token);
      setUser(userData || { 
        id: "1", 
        name: "AI Builder User", 
        email: "user@aiappbuilder.com",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return { user, login, logout, loading };
}