import React, { useState, useEffect } from "react";
import type { User } from "../types";
import { AuthContext } from "./auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("bookhub_user");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user && user.token) {
        localStorage.setItem("bookhub_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("bookhub_user");
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [user]);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
