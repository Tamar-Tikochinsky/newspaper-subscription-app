import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      name: 'משתמש',
      role: 'user',
    };
    setUser(mockUser);
  };

  const register = async (name: string, email: string, _password: string) => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      name,
      role: 'user',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
