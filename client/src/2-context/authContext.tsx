import { createContext, useState, useContext, useEffect, useCallback } from "react";

export type Role = "Admin" | "Client";

type AuthContextType = {
  isAuth: boolean;
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = { children: React.ReactNode };

// Plain JS registry — bridges React context and axios interceptor
let logoutFn: (() => void) | null = null;
let roleValue: Role | null = null;

export const authRegistry = {
  register: (fn: () => void, role: Role | null) => {
    logoutFn = fn;
    roleValue = role;
  },
  logout: () => logoutFn?.(),
  getRole: () => roleValue,
};

export const AuthProvider = ({ children }: Props) => {
  const [isAuth, setAuth] = useState(() => sessionStorage.getItem("isAuth") === "true");
  const [role, setRole] = useState<Role | null>(() => {
    const stored = sessionStorage.getItem("role");
    if (stored === "Admin" || stored === "Client") return stored;
    return null;
  });

  const login = (role: Role) => {
    setAuth(true);
    setRole(role);
    sessionStorage.setItem("isAuth", "true");
    sessionStorage.setItem("role", role);
  };

  const logout = useCallback(() => {
    setAuth(false);
    setRole(null);
    sessionStorage.removeItem("isAuth");
    sessionStorage.removeItem("role");
  }, []);

  useEffect(() => {
    authRegistry.register(logout, role);
  }, [logout, role]);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};