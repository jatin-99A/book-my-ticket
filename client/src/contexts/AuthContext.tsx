import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cinema_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const persist = (u: User) => {
    setUser(u);
    localStorage.setItem("cinema_user", JSON.stringify(u));
  };

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const stored = localStorage.getItem("cinema_users");
    const users: User[] = stored ? JSON.parse(stored) : [];
    const found = users.find((u) => u.email === email);
    if (found) {
      persist(found);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = { id: crypto.randomUUID(), name, email };
    const stored = localStorage.getItem("cinema_users");
    const users: User[] = stored ? JSON.parse(stored) : [];
    users.push(newUser);
    localStorage.setItem("cinema_users", JSON.stringify(users));
    persist(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cinema_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persist(updated);
    const stored = localStorage.getItem("cinema_users");
    const users: User[] = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) users[idx] = updated;
    localStorage.setItem("cinema_users", JSON.stringify(users));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
