import React, { createContext, useState } from 'react'

export type Auth = {
  user: string | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<Auth | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null)
  const login = (name: string) => setUser(name)
  const logout = () => setUser(null)
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthContext
