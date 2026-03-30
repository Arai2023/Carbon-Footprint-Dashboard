import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  role: 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Аккаунты — можно добавить больше
const ACCOUNTS: Record<string, { password: string; role: 'admin' | 'editor' }> = {
  admin:  { password: 'kbtu2024admin',  role: 'admin'  },
  editor: { password: 'kbtu2024editor', role: 'editor' },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('carbon_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string): boolean => {
    const account = ACCOUNTS[username.toLowerCase()];
    if (account && account.password === password) {
      const u = { username, role: account.role };
      setUser(u);
      localStorage.setItem('carbon_auth', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carbon_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
