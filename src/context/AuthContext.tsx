import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface Subscription {
  id: string;
  plan: 'basic' | 'premium' | 'vip';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
}

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  paymentMethod: PaymentMethod | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  updateSubscription: (plan: 'basic' | 'premium' | 'vip') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod | null>(null);

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
    setSubscription(null);
    setPaymentMethodState(null);
  };

  const updatePaymentMethod = async (method: PaymentMethod) => {
    // TODO: Replace with actual API call to save payment method
    setPaymentMethodState(method);
  };

  const updateSubscription = async (plan: 'basic' | 'premium' | 'vip') => {
    // TODO: Replace with actual API call to update subscription
    const newSubscription: Subscription = {
      id: '1',
      plan,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      autoRenew: true,
    };
    setSubscription(newSubscription);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        paymentMethod,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updatePaymentMethod,
        updateSubscription,
      }}
    >
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
