import type { User } from "../types";
import { createContext } from "react";

export type AuthContextType = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
};

// export a plain context from a non-TSX file so fast-refresh doesn't warn
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
