"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DBUser } from '@/lib/db';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
  user: DBUser | null;
  login: (userData: DBUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DBUser | null>(null);
  const router = useRouter();
  const currentPath = usePathname();
  const publicPaths = new Set(["/", "/login", "/about", "/research", "/methodology"]);

  useEffect(() => {
    // Keep marketing/info pages publicly visible. Protect app routes.
    if (!user && !publicPaths.has(currentPath)) {
      router.push("/login");
    }
  }, [user, currentPath, router]);

  const login = (userData: DBUser) => {
    setUser(userData);
    if (userData.role === 'admin') router.push('/admin');
    else router.push('/predict');
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
