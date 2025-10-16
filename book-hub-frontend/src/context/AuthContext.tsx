import React, { useState, useEffect } from "react";
import type { User } from "../types";
import { AuthContext } from "./auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("bookhub_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("bookhub_user", JSON.stringify(user));
    else localStorage.removeItem("bookhub_user");
  }, [user]);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
